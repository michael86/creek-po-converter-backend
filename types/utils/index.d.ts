export type Rows = string[][];
export type GetData = (rows: Rows) => Rows;
export type ShouldIncludeString = (string: string, row: string[]) => boolean;
