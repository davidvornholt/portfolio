"""Regression cases for the GitHub check history used by fetch-activity.py."""

import runpy
import unittest
from pathlib import Path

fetcher = runpy.run_path(str(Path(__file__).with_name("fetch-activity.py")))


def change(runs=(), statuses=()):
    suites = [
        {
            "app": {"databaseId": 1},
            "workflowRun": {"workflow": {"databaseId": workflow}},
            "checkRuns": {
                "totalCount": 1,
                "nodes": [
                    {"name": "check", "databaseId": number, "conclusion": conclusion}
                ],
            },
        }
        for workflow, number, conclusion in runs
    ]
    commit = {
        "oid": "head",
        "status": {"contexts": statuses},
        "checkSuites": {"totalCount": len(suites), "nodes": suites},
    }
    return {"headRefOid": "head", "commits": {"nodes": [{"commit": commit}]}}


class CheckHistory(unittest.TestCase):
    def test_new_run_supersedes_old_failure_even_when_returned_first(self):
        self.assertEqual(
            fetcher["result"](change([(1, 5, "SUCCESS"), (1, 1, "FAILURE")])),
            ("passed", []),
        )

    def test_other_workflow_with_same_job_name_keeps_its_failure(self):
        self.assertEqual(
            fetcher["result"](change([(1, 5, "SUCCESS"), (2, 1, "TIMED_OUT")])),
            ("failed", ["check"]),
        )

    def test_latest_commit_status_counts_alongside_check_runs(self):
        statuses = [
            {"context": "preview", "state": state, "createdAt": date}
            for state, date in [("ERROR", "2026-01-02"), ("SUCCESS", "2026-01-01")]
        ]
        self.assertEqual(
            fetcher["result"](change([(1, 1, "SUCCESS")], statuses)),
            ("failed", ["preview"]),
        )

    def test_empty_history_and_skipped_runs_have_distinct_results(self):
        self.assertEqual(fetcher["result"](change()), ("untested", []))
        self.assertEqual(
            fetcher["result"](change([(1, 1, "SKIPPED")])), ("skipped", [])
        )

    def test_incomplete_connection_and_wrong_head_are_rejected(self):
        with self.assertRaises(ValueError):
            fetcher["complete"]({"nodes": [], "totalCount": 1})
        with self.assertRaises(ValueError):
            fetcher["result"]({**change(), "headRefOid": "different"})


if __name__ == "__main__":
    unittest.main()
