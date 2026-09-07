// September 5 tariff snapshot applied to the September 7 study's native logs.
// Mixed costs and output include persisted sessions only, not missing CLI runs.
export const studyWorkflows = [
  {
    label: 'All-Spark',
    prosaCost: 4.0294594,
    rotaCost: 1.7176051,
    outputTokens: 216_840,
    partial: false,
  },
  {
    label: 'All-Luna',
    prosaCost: 1.72626292,
    rotaCost: 1.02309456,
    outputTokens: 478_867,
    partial: false,
  },
  {
    label: 'All-Astra',
    prosaCost: 27.282088,
    rotaCost: 17.418488,
    outputTokens: 84_421,
    partial: false,
  },
  {
    label: 'Astra + Luna',
    prosaCost: 19.13991804,
    rotaCost: 29.32577392,
    outputTokens: 162_103,
    partial: true,
  },
] as const;

export const findingRows = [
  {
    finding: 'ProsaBridge: corpus history mismatch',
    outcomes: { spark: 'Missed', luna: 'Missed', mixed: 'Missed', astra: 'Found and fixed' },
  },
  {
    finding: 'ProsaBridge: empty affected-candidate selection',
    outcomes: { spark: 'Missed', luna: 'Missed', mixed: 'Missed', astra: 'Found and fixed' },
  },
  {
    finding: 'Rota: automatic request loop',
    outcomes: { spark: 'No recovery', luna: 'No recovery', mixed: 'Repair after exposure', astra: 'Found and fixed' },
  },
  {
    finding: 'Rota: private response headers',
    outcomes: { spark: 'No recovery', luna: 'Detected; faulty repair', mixed: 'Useful fix retained', astra: 'Missed' },
  },
  {
    finding: 'ProsaBridge: revision-test guardrail',
    outcomes: { spark: 'Useful fix retained', luna: 'No recovery', mixed: 'No recovery', astra: 'Selected from Spark' },
  },
] as const;

export const matrixModels = [
  { key: 'spark', label: 'Spark' },
  { key: 'luna', label: 'Luna' },
  { key: 'mixed', label: 'Mixed' },
  { key: 'astra', label: 'Astra' },
] as const;

export const contaminationEvents = [
  { time: '17:38:14', action: 'Listed branches', detail: 'Sibling refs became visible through git branch -avv --no-abbrev.' },
  { time: '17:38:24', action: 'Read the all-Astra fix', detail: 'git show exposed the sibling solution before the review finished.' },
  { time: 'Following minutes', action: 'Read the hook and browser tests', detail: 'Repeated access to the same all-Astra commit. No precise timestamp claimed.' },
  { time: '17:47:10', action: 'Generated a fixture patch', detail: 'The mixed fixture was identical to the all-Astra version.' },
] as const;
