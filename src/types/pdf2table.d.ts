/**
 * Type definitions for pdf2table
 */
declare module "pdf2table" {
  /**
   * Callback function for parsing PDF table data.
   *
   * @param error - An error object if parsing fails, otherwise null.
   * @param rows - An array of rows (each row is an array of cells).
   * @param rowsDebug - An array of rows containing debug information.
   */
  export type ParseCallback = (error: Error | null, rows: any[][], rowsDebug: any[][]) => void;

  export interface Pdf2Table {
    /**
     * Parses a PDF provided as a Buffer and extracts table data.
     *
     * @param buffer - A Buffer containing the PDF data.
     * @param callback - A callback function to handle the parsed data or error.
     */
    parse(buffer: Buffer, callback: ParseCallback): void;

    /**
     * Parses a PDF file from the given path and extracts table data.
     *
     * @param path - The file path to the PDF.
     * @param callback - A callback function to handle the parsed data or error.
     */
    parseFile(path: string, callback: ParseCallback): void;
  }

  const pdf2table: Pdf2Table;
  export default pdf2table;
}
