"""Fetch the portfolio's checked-in chart. Raw API replies never leave memory."""

from concurrent.futures import ThreadPoolExecutor
import json
import os
import subprocess
import tempfile
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

BERLIN = ZoneInfo("Europe/Berlin")
OUTPUT = (
    Path(__file__).resolve().parents[1]
    / "src/features/portfolio/activity/snapshot.json"
)
QUERY = """
query($search:String!, $after:String) {
 search(query:$search,type:ISSUE,first:20,after:$after) {
  issueCount pageInfo {endCursor hasNextPage}
  nodes {... on PullRequest {
   id mergedAt additions deletions headRefOid author {login} repository {isPrivate} PUBLIC_FIELDS
   commits(last:1) {nodes {commit {
    oid status {contexts {context state createdAt}}
    checkSuites(first:30) {totalCount nodes {app {databaseId} workflowRun {workflow {databaseId}}
     checkRuns(first:80) {totalCount nodes {name databaseId conclusion}}
    }}
   }}}
  }}
 }
}
"""


def require(condition):
    if not condition:
        raise ValueError("Incomplete GitHub data")


def request(query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    for attempt in range(5):
        try:
            req = Request(
                "https://api.github.com/graphql",
                body,
                headers={
                    "Authorization": "Bearer " + os.environ["GITHUB_TOKEN"],
                    "Content-Type": "application/json",
                },
            )
            with urlopen(req, timeout=90) as response:
                payload = json.load(response)
            require("errors" not in payload)
            return payload["data"]["search"]
        except HTTPError as error:
            if attempt == 4 or error.code not in {403, 429, 502, 503, 504}:
                raise
            delay = int(
                error.headers.get("Retry-After", 60 if error.code in {403, 429} else 3)
            )
            time.sleep(delay * (attempt + 1))
        except (OSError, ValueError):
            if attempt == 4:
                raise
            time.sleep(2**attempt)


def complete(connection):
    require(connection["totalCount"] == len(connection["nodes"]))
    return connection["nodes"]


def result(pr):
    (commit,) = pr["commits"]["nodes"]
    head = commit["commit"]
    require(head["oid"] == pr["headRefOid"])
    latest = {}
    for suite in complete(head["checkSuites"]):
        for run in complete(suite["checkRuns"]):
            workflow = (suite["workflowRun"] or {}).get("workflow") or {}
            key = (
                (suite["app"]["databaseId"], workflow.get("databaseId")),
                run["name"],
            )
            if key not in latest or latest[key][0] < run["databaseId"]:
                latest[key] = (run["databaseId"], run["conclusion"])
    for status in (head["status"] or {"contexts": []})["contexts"]:
        key = ("status", status["context"])
        if key not in latest or latest[key][0] < status["createdAt"]:
            latest[key] = (status["createdAt"], status["state"])
    failures = [
        key[1]
        for key, (_, state) in latest.items()
        if state in {"FAILURE", "ERROR", "TIMED_OUT", "STARTUP_FAILURE"}
    ]
    if failures:
        return "failed", sorted(failures)
    if any(state == "SUCCESS" for _, state in latest.values()):
        return "passed", []
    if latest and all(state in {"SKIPPED", "NEUTRAL"} for _, state in latest.values()):
        return "skipped", []
    require(not latest)
    return "untested", []


def collect(search, public):
    # For private work even the request omits identifying fields.
    fields = "title url publicRepo:repository {nameWithOwner}" if public else ""
    query = QUERY.replace("PUBLIC_FIELDS", fields)
    seen = set()
    after = None
    expected = None
    while True:
        page = request(query, {"search": search, "after": after})
        if expected is None:
            expected = page["issueCount"]
        require(page["issueCount"] == expected and expected <= 1000)
        for pr in page["nodes"]:
            require(pr["id"] not in seen and pr["mergedAt"])
            seen.add(pr["id"])
            yield pr
        if not page["pageInfo"]["hasNextPage"]:
            require(len(seen) == expected)
            return
        after = page["pageInfo"]["endCursor"]
        require(after)


def weekly(week):
    public, day, fetched = week
    visibility = "public" if public else "private"
    records = []
    begin = datetime.combine(day, datetime.min.time(), BERLIN)
    stop = min(begin + timedelta(days=7, seconds=-1), fetched)
    interval = "..".join(x.astimezone(timezone.utc).isoformat() for x in (begin, stop))
    search = f"sort:created-asc is:merged is:pr is:{visibility} author:davidvornholt merged:{interval}"
    seen = 0
    for pr in collect(search, public):
        seen += 1
        require(begin <= datetime.fromisoformat(pr["mergedAt"]) <= stop)
        require(
            pr["author"]["login"] == "davidvornholt"
            and pr["repository"]["isPrivate"] != public
        )
        outcome, failures = result(pr)
        if not public and outcome != "passed":
            continue
        merged = datetime.fromisoformat(pr["mergedAt"])
        record = {
            "date": merged.astimezone(BERLIN).date().isoformat(),
            "lines": pr["additions"] + pr["deletions"],
            "result": outcome,
        }
        if public:
            record.update(
                repo=pr["publicRepo"]["nameWithOwner"], title=pr["title"], url=pr["url"]
            )
            if failures:
                record["failed"] = failures
        records.append((merged, record))
    return seen, records


def snapshot():
    fetched = datetime.now(timezone.utc).replace(microsecond=0)
    end = fetched.astimezone(BERLIN).date()
    start = end - timedelta(days=90)
    changes = []
    weeks = [
        (public, start + timedelta(days=offset), fetched)
        for public in (True, False)
        for offset in range(0, 91, 7)
    ]
    retrieved = 0
    with ThreadPoolExecutor(max_workers=2) as pool:
        for count, records in pool.map(weekly, weeks):
            retrieved += count
            changes.extend(records)
    since = datetime.combine(start, datetime.min.time(), BERLIN).astimezone(
        timezone.utc
    )
    search = f"is:pr is:merged author:davidvornholt merged:{since.isoformat()}..{fetched.isoformat()}"
    all_changes = request(
        "query($search:String!){search(type:ISSUE, query:$search, first:1){issueCount}}",
        {"search": search},
    )
    require(retrieved == all_changes["issueCount"])
    require(changes)
    history = [
        result(pr)[0]
        for pr in collect(
            f"repo:davidvornholt/portfolio is:pr is:merged author:davidvornholt merged:<={fetched.isoformat()}",
            False,
        )
    ]
    require(history)
    return {
        "fetched": fetched.isoformat(),
        "start": start.isoformat(),
        "end": end.isoformat(),
        "portfolioAllPassed": len(history)
        if all(r == "passed" for r in history)
        else None,
        "count": len(changes),
        "changes": [entry for _, entry in sorted(changes, key=lambda item: item[0])],
    }


if __name__ == "__main__":
    try:
        data = snapshot()
        with tempfile.NamedTemporaryFile(
            dir=OUTPUT.parent, suffix=".json", delete=False
        ) as file:
            temporary = Path(file.name)
        try:
            temporary.write_text(json.dumps(data, ensure_ascii=False))
            subprocess.run(
                [
                    "bun",
                    "x",
                    "--no-install",
                    "biome",
                    "format",
                    "--write",
                    str(temporary),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            temporary.replace(OUTPUT)
        finally:
            temporary.unlink(missing_ok=True)
        print(f"Saved {len(data['changes'])} publishable changes.")
    except Exception as error:
        # API errors can embed private names. Report only the local failure site.
        import traceback

        print(
            "Snapshot rejected at line",
            traceback.extract_tb(error.__traceback__)[-1].lineno,
            type(error).__name__,
            getattr(error, "code", ""),
            [
                frame.lineno
                for frame in traceback.extract_tb(error.__traceback__)
                if frame.filename == __file__
            ],
            file=sys.stderr,
        )
        sys.exit(1)
