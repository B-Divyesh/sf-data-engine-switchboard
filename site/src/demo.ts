export type DemoCase = {
  name: string;
  code: string;
  finding: string;
  heuristic: string;
};

export const demoCases: Record<string, DemoCase> = {
  value: { name: 'tax rounding changes a value', code: 'VALUE', finding: 'A value differs in the bundled sample.', heuristic: 'Plan warnings ask for review. They do not decide pass or fail.' },
  schema: { name: 'identifier changes schema', code: 'SCHEMA', finding: 'A schema differs in the bundled sample.', heuristic: 'Plan warnings ask for review. They do not decide pass or fail.' },
  order: { name: 'sort direction changes order', code: 'ORDER', finding: 'The same rows have a different order in the bundled sample.', heuristic: 'Plan warnings ask for review. They do not decide pass or fail.' }
};
