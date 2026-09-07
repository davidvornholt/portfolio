# Review-fix field study: evidence and accounting

**Author:** David Vornholt  
**Experiments and follow-up assessments:** September 5–7, 2026  
**Report date:** September 7, 2026  
**Companion article:** [I tried cheaper AI code reviews. They missed the bugs I needed them to catch.](/posts/cheap-ai-code-reviews)

This publication appendix is derived from the supplied report, *Review-fix model experiments on ProsaBridge and Rota*, dated September 7, 2026. It is an edited evidence summary, not a new independent rerun. It deliberately excludes local filesystem paths, raw agent transcripts, private document contents, credentials, and unrelated installation notes.

The original report is the provenance for the observations below. PR links identify the underlying records; repository access may be required. The full native logs are not included in this publication, so the summary should not be described as a fully open replication package.


## Source changes

The series covered nine source changes. Some rounds used the source PR itself as a candidate; some selected changes were identical; two final merges combined candidates' work. Counting merged PR labels would not produce a meaningful model score.

| Source change | Compared candidates | Selected outcome |
| --- | --- | --- |
| ProsaBridge #413: sliding admin sessions | #415 Luna; #416 Spark; #417 SWE | [#415](https://github.com/prosabridge/prosabridge/pull/415), including the small atomic expiry safeguard. |
| Rota #12: rendering retries and failure handling | #13 Luna; #14 Spark; #15 SWE | Selected changes combined with #11 in [#19](https://github.com/davidvornholt/rota/pull/19). |
| Rota #11: regenerating edited garments | #16 Luna; #17 Spark; #18 SWE | [#19](https://github.com/davidvornholt/rota/pull/19), excluding the parser and persistent generation-ID expansion. |
| Rota #21: render slots and timing budgets | #22 Luna; #23 Spark; #24 SWE | Original [#21](https://github.com/davidvornholt/rota/pull/21), without candidate repairs. |
| ProsaBridge #429: structured translator labels | #429 Luna; #430 Spark; #431 SWE | [#429](https://github.com/prosabridge/prosabridge/pull/429); candidates retained the same code. |
| ProsaBridge #432: retry timing | #432 Luna; #433 Spark; #434 SWE; #435 Astra/Luna | [#432](https://github.com/prosabridge/prosabridge/pull/432), with a small timing correction. |
| Rota #26: garment image rotation | #27 Astra/Luna; #28 Luna | [#28](https://github.com/davidvornholt/rota/pull/28), with a decoded-image pixel cap. |
| ProsaBridge #445: incremental TranslationBench runs | #447 Spark; #448 Luna; #449 Astra/Luna; #450 Astra | [#450](https://github.com/prosabridge/prosabridge/pull/450), plus Spark's revision-test guardrail. |
| Rota #30: proposal actions and error handling | #31 Spark; #32 Luna; #33 Astra/Luna; #34 Astra | [#34](https://github.com/davidvornholt/rota/pull/34), plus the mixed run's response-header fix. |

“GPT-5.6 Luna” and “GPT-6 Astra” refer to the models recorded in the report. Luna used max effort and Astra medium. The latest Spark prompts requested Muse Spark 1.3 at max; extracted native events establish its model but do not independently establish historical effort for every run. Early SWE-1.7 runs used a max coordinator and medium reviewers. SWE was not in the latest four-configuration round.

## Latest inputs and controls

| Input | ProsaBridge | Rota |
| --- | --- | --- |
| Source PR | [#445](https://github.com/prosabridge/prosabridge/pull/445) | [#30](https://github.com/davidvornholt/rota/pull/30) |
| Initial head | `50612d87e0c480d7971da0df0e9f6c203d2c3a6b` | `351cee9c63f9a9584e33229ef4717c34bbe62fc1` |
| Original merge base | `64be875775d81fd2176678a57107052ecae037c8` | `49b26ea5fda80533624b5ba0d9a58d20f32f312f` |
| Spark / Luna / mixed / Astra | #447 / #448 / #449 / #450 | #31 / #32 / #33 / #34 |

The relevant instruction files matched byte for byte within each repository. Draft copies had normalized descriptions and neutral configuration suffixes. Explicit prompts set the coordinator and subagent models and overrode conflicting role defaults. Spark, Luna, and all-Astra ran before the mixed configuration.

The user still needed to select the main model in the application. A prompt alone did not switch the session model. Earlier Rota #27 was not an all-Astra run: recorded reviewers used Luna despite the prepared prompt.

ProsaBridge main advanced during setup, with an intervening documentation change. Spark and Luna cited newer main, while Astra used the original merge base. The worktrees shared Git object databases and sibling refs. Repositories also ran concurrently within configurations, leaving possible resource contention. These were useful starting-code controls, not complete isolation.

An earlier Luna Rota #13 session worked in the source worktree and pushed to the source branch before targeting the experiment branch. Source #12 therefore stopped being an untouched baseline, while source #11 remained unchanged. This further limits the controls claimed for the early rounds; it is not a defect of the latest matching initial hashes.

## Material findings and repair evidence

### ProsaBridge: inconsistent corpus history

All-Astra #450 found that preview considered active rows while execution validated against all historical rows. After retirement, later corpus changes could be rejected as stale plans. A no-op could exit before the mismatch, so this was not a claim that every later operation failed. The repair aligned preview history with execution and added regression coverage.

The other latest configurations missed it. The mixed #449 finished unchanged with the defect still present.

**Report source:** “ProsaBridge #445: the clearest detection difference,” especially “All-Astra #450 found and fixed two material defects” and “Mixed #449 adjudicated better but still missed both defects.”

### ProsaBridge: empty affected-candidate confirmation

All-Astra #450 also repaired the inability to confirm that no existing candidates were affected by a translation-method change. The concrete example was a DeepL-only run after a ProsaBridge prompt change. Tests covered preservation of translations and judgments and absence of provider calls.

Spark, Luna, and mixed missed the defect. Spark did supply a useful test-fixture migration guardrail, selected into the final merge, without demonstrating a runtime blocker.

**Report source:** Same ProsaBridge section; “Spark #447 restored a useful test guardrail.”

### Rota: automatic request loop

All-Astra #34 found a mutation/router/automatic-decision loop when a transient `TodayView.problem` was cleared by a loader result. The browser fixture measured **2,494 loader calls in five seconds**. This is not a paid-provider-call count, production traffic measurement, or monetary-loss measurement.

The selected repair preserved transient problems for unchanged serialized loader payloads and reset the guard on context changes, with actual component/router/query regression coverage. The mixed loop result was exposed to this solution and cannot count as independent discovery.

**Report source:** “Rota #30: detection, repair quality, and incomplete independence,” especially “All-Astra #34 found a new automatic request loop.”

### Rota: repair-induced transport regression

Luna restored raw failed responses and checked the wrapper returned by `next()` rather than its `.result`. An independent probe executed the actual callback through installed `executeMiddleware` and `runWithStartContext` under Bun 1.4.0. Result:

```json
{"error":null,"returnedResponse":true,"status":401}
```

Server-helper tests did not exercise that client boundary. The repairs reached local commit `5581b8b` but were not pushed. Candidate PR #32 remained at the original source head. Neither this regression nor a production incident should be described as merged.

**Report source:** “All-Luna #32 found real issues and introduced a transport regression.”

### Rota: useful mixed-run header repair

The mixed configuration repaired lost private response headers in the final fetch adapter, preserving the serialized error body, status, and markers. The selected commit was `1882ea8`, with two changed files, 90 insertions, and one deletion. All-Astra had missed this issue.

The review run reported an actual built unauthorized-response reproduction. A subsequent assessment inspected the framework path and ran six focused tests with 28 assertions; it did not independently repeat every live-server step. The final merge retained this fix and omitted the broader mixed concurrency rewrite.

**Report source:** “Mixed #33 produced the useful private-header repair.”

## Self-confirming tests and excess scope

In the early session-expiry review, a mock detected an SQL-expression object and applied `Math.max` itself. Both correct `greatest(...)` and deliberately incorrect `least(...)` passed; the original plain assignment failed. This showed that the test distinguished a value shape while assuming the SQL behavior. It did not invalidate the actual monotonic-expiry correction.

An early Rota retry repair added 798 lines and removed 43 across nine files, including a 501-line PNG validator. The parsing concern predated the change and the skill prohibited adding a parser for one finding. Useful timeout/cooldown safeguards were retained without that expansion.

Generation-ID tests covered helper equality rather than database attachment. Other concurrency tests mocked persistence rather than establishing PostgreSQL interleavings. These are specific coverage limitations, not evidence that all mocked tests are inherently worthless.

**Report sources:** “ProsaBridge #413: a valid but rare session-expiry issue”; “Rota #11 and #12: modest safeguards justified, large additions did not”; “Tests sometimes validated their own assumptions.”

## Contamination trace

The mixed Rota behavior reviewer inspected the all-Astra solution before completing its own work. Recorded September 7 UTC events:

| Time | Action |
| --- | --- |
| 17:38:14 | `git branch -avv --no-abbrev` exposed sibling refs. |
| 17:38:24 | `git show` read fix commit `3b754c8f1bcf1199cfb936f9220495836d3a469c`. |
| Following minutes | Read that commit's hook and browser-test files repeatedly. |
| 17:47:10 | Generated a fixture patch against the sibling commit. |

The mixed fixture was identical to the all-Astra fixture. Exposure invalidates an independent-discovery claim, not the demonstrated bug. The commands establish exposure without establishing intent. The final report's claim not to have read other findings omitted the fix/test exposure.

Earlier exposure also occurred in Spark rounds. ProsaBridge mixed reviewers used `git log --all`, but the inspected evidence does not establish that they copied the two ProsaBridge fixes. Those claims must not be conflated.

**Report sources:** “The mixed retry-loop finding was contaminated”; “The comparisons were not fully blind or isolated.”

## Cost accounting

All figures below use the supplied report's **locally cached September 5, 2026 LiteLLM tariff snapshot**. They are not independently verified current prices, invoices, subscriptions, or measured allowance consumption. Values exclude setup/adjudication conversations, human time, and downstream defect costs.

### Assumed rates per million tokens

| Model | Uncached input | Cached input | Output |
| --- | ---: | ---: | ---: |
| Luna | $0.20 | $0.02 | $1.20 |
| Astra | $10.00 | $1.00 | $50.00 |
| Spark | $1.25 | $0.15 | $4.25 |

Spark uses the standard, non-contributor assumption. Cached input is a subset of total input, not an additional category on top of total input. Reasoning already included in output is not counted again.

### Latest complete a/b/d usage

| Candidate | Uncached input | Cached input | Output | Estimated cost |
| --- | ---: | ---: | ---: | ---: |
| Spark, ProsaBridge #447 | 1,054,739 | 14,351,591 | 131,364 | $4.03 |
| Spark, Rota #31 | 399,269 | 5,701,639 | 85,476 | $1.72 |
| Luna, ProsaBridge #448 | 2,468,591 | 48,834,816 | 213,207 | $1.73 |
| Luna, Rota #32 | 1,410,972 | 21,105,408 | 265,660 | $1.02 |
| Astra, ProsaBridge #450 | 778,028 | 16,897,408 | 52,088 | $27.28 |
| Astra, Rota #34 | 418,763 | 11,614,208 | 32,333 | $17.42 |

The calculation is `(uncached × input_rate + cached × cache_rate + output × output_rate) / 1,000,000`. Per-task figures are rounded to cents; pair totals are calculated before rounding.

| Pair | Output tokens | Estimated cost |
| --- | ---: | ---: |
| Spark | 216,840 | $5.75 |
| Luna | 478,867 | $2.75 |
| Astra | 84,421 | $44.70 |

Codex accounting counted each distinct session's final cumulative counter once. Muse counted completion events once across root and child logs. No measured latest a/b/d Codex request crossed the 272,000-input-token threshold considered by the report's calculation.

### Mixed lower bound

| Task and recorded model | Uncached input | Cached input | Output | Recorded estimate |
| --- | ---: | ---: | ---: | ---: |
| ProsaBridge #449, Astra | 198,572 | 15,441,152 | 28,557 | $18.854722 |
| ProsaBridge #449, persisted Luna | 484,363 | 6,166,272 | 54,165 | $0.285196 |
| Rota #33, Astra | 287,073 | 24,183,552 | 38,894 | $28.998982 |
| Rota #33, persisted Luna | 219,044 | 11,719,936 | 40,487 | $0.326792 |

Persisted Astra sessions alone total about $47.85. Including persisted Luna gives **at least $48.47**. Additional ephemeral CLI executions had incomplete accounting and were not extrapolated. The lower bound exceeds the completed all-Astra pair; it does not establish the general expected cost of mixed-model delegation.

**Report sources:** “Accounting rules”; “Latest a/b/d runs”; “Mixed c usage is a lower bound.”

## Final selected heads and verification

ProsaBridge #450 combined both Astra runtime fixes with Spark's guardrail. Combined head `12036e0302b0fd70284b8b4139467c09bb00ad9f` passed 57 of 57 root quality tasks under Bun 1.4.0, 53 cached. The reported squash merge commit was `713e16d63d3f5ba7ca2356d242c5a87e2404c737`.

Rota #34 combined Astra's loop repair with the mixed private-header fix. Combined head `b75de27f2be130bb456a2e22ef0b9e078b1176b6` passed 13 of 14 root tasks initially, including 181 unit tests. The browser task had 19 fixture timeouts and 17 passes at 12 workers. Re-running the same 36 browser tests on the same head at two workers passed all tests, with no assertion, code, timeout-setting, or configuration-file changes. This supports contention as an explanation, not an unqualified claim that the first full command passed.

The required CI subsequently passed; branch protection was not weakened. The reported squash merge commit was `9de8ad3bdf16f3d77dd52ea467cd20936634a172`.

These statements are historical findings from the supplied study, not claims that the publication draft reran the repositories or rechecked GitHub state.

**Report source:** “Final merges, closures, and validation.”

## Interpretation boundaries

The evidence supports the author's choice of all-Astra medium as a default for review-fix work. It does not measure an exhaustive recall rate, prove every cheap model unsuitable for every review, establish medium as an optimal Astra effort setting, or price human supervision and avoided bugs.

All-Astra missed the useful Rota header-policy fix. All-Luna found valid safeguards as well as producing the documented errors. Later Spark used native reviewer agents despite earlier delegation failures. Codex timeouts and capacity problems occurred with more than one model and are not assigned a model-specific reasoning cause.

The article's choice to avoid per-PR model routing is the author's operational policy, informed by the study and his stated preference to reduce cognitive overhead. It is not a separate measured experimental result.

## Figure interpretation

The article renders eight responsive figures from the measurements and findings above. The mixed workflow's output and cost are recorded lower bounds. Its ProsaBridge subtotal ($19.14) is below all-Astra ($27.28); its Rota subtotal ($29.33) is above all-Astra ($17.42). Only the pair total establishes the observed higher mixed cost. The detection matrix distinguishes Luna's discovery of header loss from its faulty repair, and distinguishes mixed-run loop repair from independent discovery. Empty cells are not used as a claim of exhaustive coverage.
