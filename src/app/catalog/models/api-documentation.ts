export interface ApiEntry {
  readonly name: string;
  readonly type: string;
  readonly default: string | null;
  readonly required: boolean;
  readonly description: string;
}

export interface ApiDocumentation {
  readonly inputs: readonly ApiEntry[];
  readonly outputs: readonly ApiEntry[];
  readonly slots: readonly ApiEntry[];
  readonly cssProperties: readonly ApiEntry[];
}

export const EMPTY_API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [],
};
