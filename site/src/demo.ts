export type DemoCase = {
  name: string;
  rows: string;
  time: string;
  memory: string;
  stream: string;
  code: string;
  finding: string;
  heuristic: string;
};

export const demoCases: Record<string, DemoCase> = {
  value: {
    name: 'tax rounding changes a value',
    rows: '3 / 3',
    time: '14.2 / 3.8 ms',
    memory: '84 / 42 MB',
    stream: 'applied',
    code: 'VALUE',
    finding: 'Values differ at row 1, column 2.',
    heuristic: 'No plan markers detected. This does not prove every operator streamed.'
  },
  schema: {
    name: 'identifier changes schema',
    rows: '3 / 3',
    time: '12.7 / 3.1 ms',
    memory: '82 / 41 MB',
    stream: 'applied',
    code: 'SCHEMA',
    finding: 'order_id: int64 vs UInt64 under strict schema policy.',
    heuristic: 'No plan markers detected. Dtype evidence is measured from both outputs.'
  },
  order: {
    name: 'sort direction changes order',
    rows: '3 / 3',
    time: '13.5 / 3.6 ms',
    memory: '83 / 43 MB',
    stream: 'applied',
    code: 'ORDER',
    finding: 'The same rows were emitted in a different order.',
    heuristic: 'global_sort marker found. Plan text is version-sensitive; inspect before rollout.'
  }
};
