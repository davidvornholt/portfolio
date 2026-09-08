# Methods and cost notes

David Vornholt. Experiments and follow-up checks: September 5 to 7, 2026.

[Back to the article](/posts/cheap-ai-code-reviews)

This is a publication summary of my September 7 study report, not a new experiment. The series covered nine code changes across two projects. The article focuses on the final comparison of two changes and four AI setups.

Some work involved an unpublished internal tool. Its name, functionality, implementation details, repository links, and commit identifiers are intentionally omitted. The internal findings below are author-reported results from the private study. Readers cannot independently reproduce that part from this summary.

## What was compared

A review-fix run checks a code change, repairs important problems, verifies the repairs, and stops. The lead agent coordinates separate reviewing and repair agents.

| Setup | Lead agent | Reviewing and repair agents | Application |
| --- | --- | --- | --- |
| Spark throughout | Muse Spark 1.3 | Muse Spark 1.3 | Muse Code |
| Luna throughout | GPT-5.6 Luna | GPT-5.6 Luna | Codex |
| Astra throughout | GPT-6 Astra | GPT-6 Astra | Codex |
| Astra leading Luna | GPT-6 Astra | GPT-5.6 Luna | Codex |

Astra used medium effort and Luna max. The later Spark prompts requested max. Native Spark records confirm the model but do not independently establish the historical effort setting for every run. SWE-1.7 appeared in earlier rounds, not this final comparison. No Astra effort-setting comparison was performed.

The final round used matching initial code and relevant instructions for each setup within each project. This was not full isolation. Working directories shared Git history, one base reference moved during preparation, and concurrent runs could compete for resources. Some earlier reviews also had delegation or baseline problems.

## Results and their limits

Astra independently found and repaired three important defects in the final round. Two affected intended behavior in the internal tool. Spark, Luna, and the mixed setup missed both. The third was an automatic loop in Rota. Its browser reproduction recorded 2,494 loader calls in five seconds. This was not a count of paid AI calls or observed production traffic.

Luna's attempted Rota repair reintroduced a failure in which server errors could reach callers as successful values. A separate probe against the installed framework reproduced it. The repair remained local and was not shipped. Luna's internal-task review was incomplete, so its low cost is not the price of an equivalent finished result.

The mixed Rota reviewer read Astra's completed fix and tests before reporting the same loop. That result does not count as independent discovery. The trace establishes exposure, not intent. A different mixed repair was useful and retained alongside Astra's work. Spark also contributed a useful test improvement.

Earlier rounds produced useful safeguards as well as unnecessary expansion and weak tests. One test passed even after the protected behavior was deliberately broken. These observations do not imply that all cheaper-model work was useless.

This was a small, varied study of complete workflows, not a randomized model ranking. There is no exhaustive list of all bugs, so no detection percentage is claimed. Execution interruptions affected multiple models and are not treated as proof of weaker reasoning. Human supervision and the financial impact of avoided defects were not measured.

## Estimated costs

Estimates apply a locally saved September 5, 2026 price snapshot to native usage records. They are not invoices, current price claims, subscription charges, or measured subscription consumption. Setup conversations, assessment conversations, human time, and downstream defect costs are excluded.

Rates in USD per million tokens:

| Model | Uncached input | Cached input | Output |
| --- | ---: | ---: | ---: |
| Spark | 1.25 | 0.15 | 4.25 |
| Luna | 0.20 | 0.02 | 1.20 |
| Astra | 10.00 | 1.00 | 50.00 |

Cached input is already part of total input. It is not counted twice. Reasoning included in output is not added again. Spark uses the standard, non-contributor rate assumption.

The calculation is `(uncached input × input rate + cached input × cached rate + output × output rate) / 1,000,000`.

| Setup and task | Uncached input | Cached input | Output | Estimate |
| --- | ---: | ---: | ---: | ---: |
| Spark, internal task | 1,054,739 | 14,351,591 | 131,364 | $4.03 |
| Spark, Rota | 399,269 | 5,701,639 | 85,476 | $1.72 |
| Luna, internal task | 2,468,591 | 48,834,816 | 213,207 | $1.73 |
| Luna, Rota | 1,410,972 | 21,105,408 | 265,660 | $1.02 |
| Astra, internal task | 778,028 | 16,897,408 | 52,088 | $27.28 |
| Astra, Rota | 418,763 | 11,614,208 | 32,333 | $17.42 |

Totals before rounding are $5.7470645 for Spark, $2.74935748 for Luna, and $44.700576 for Astra. The chart rounds those totals to cents. Codex accounting counted each distinct session's final cumulative counter once. Muse accounting counted completion events once across the lead and child sessions.

Only the recorded portion of the mixed runs could be priced:

| Task and model | Uncached input | Cached input | Output | Estimate |
| --- | ---: | ---: | ---: | ---: |
| Internal task, Astra | 198,572 | 15,441,152 | 28,557 | $18.854722 |
| Internal task, Luna | 484,363 | 6,166,272 | 54,165 | $0.28519604 |
| Rota, Astra | 287,073 | 24,183,552 | 38,894 | $28.998982 |
| Rota, Luna | 219,044 | 11,719,936 | 40,487 | $0.32679192 |

These records total $48.46569196, displayed as **at least $48.47**. Additional executions lacked complete usage accounting and were not estimated. The mixed subtotal was lower on the internal task but higher on Rota and across the pair. The pair total establishes that these mixed runs did not save money, not that mixing models must always cost more.

## Rota source records

The final round began from [Rota #30](https://github.com/davidvornholt/rota/pull/30). Its candidates were [Spark #31](https://github.com/davidvornholt/rota/pull/31), [Luna #32](https://github.com/davidvornholt/rota/pull/32), [mixed #33](https://github.com/davidvornholt/rota/pull/33), and [Astra #34](https://github.com/davidvornholt/rota/pull/34). The selected result combined Astra's loop repair with the separate mixed-run fix. Luna's candidate branch did not contain its unpushed local repair.

These links identify the study's records. The publication does not include the full native logs or the internal project's source material and is not a fully open replication package.
