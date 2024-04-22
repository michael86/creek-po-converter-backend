export type Rows = string[][];
export type GetData = (rows: Rows) => Promise<Rows>;
export type ShouldIncludeString = (string: string, row: string[]) => Promise<boolean | undefined>;
