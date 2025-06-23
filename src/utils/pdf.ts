const pdf2table = require("pdf2table");
import fs from "fs/promises";
import { selectPrefixes } from "../queries/prefixes";
import { Prefix } from "../types/queries";
import { ParsedPdf, Part, PurchaseOrderData } from "../types/pdf";
import { isValidDate } from ".";
import { PdfError } from "./pdfError";
import { parseDate } from "../utils/index";

let PREFIXES: Prefix[] | null = null;

(async () => {
  PREFIXES = await selectPrefixes();
  if (!PREFIXES || PREFIXES.length === 0) {
    console.error("No prefixes available. Exiting application.");
    process.exit(1);
  }
})();

export const processFile = async (file: string): Promise<ParsedPdf> => {
  if (!PREFIXES) return null; // safeguard

  try {
    const fileData = await fs.readFile(file);

    return new Promise((resolve, reject) => {
      pdf2table.parse(fileData, async (err: string, rows: string[][]) => {
        if (err) {
          console.error(`Error parsing PDF ${file}:`, err);
          return reject(new Error("Parsing error"));
        }

        const poArr = rows.find((row) => row[0] === "Our P.O. No:");
        const refArr = rows.find((row) => row[0] === "Order reference:");

        if (!poArr || poArr.length < 2) return reject(new PdfError("Missing purchase order"));
        if (!refArr || refArr.length < 2) return reject(new PdfError("Missing order reference"));

        const purchaseOrder = poArr[1];
        if (isNaN(+purchaseOrder))
          reject(new PdfError("Invalid purchase order - must be a number"));

        const orderRef = refArr[1]; // We can't really check this is valid if missing as ordcer ref can be a number or string

        const tableStartIndex = rows.findIndex(
          (row) => row[0].toLowerCase() === "product description and notes"
        );

        if (tableStartIndex === -1) return reject(new PdfError("Table start not found"));

        const table = rows.splice(tableStartIndex + 1); //Splice of the table start

        try {
          const data = await getTableData(table);
          resolve({ data, purchaseOrder, orderRef });
        } catch (err: any) {
          return reject(new PdfError(err.message));
        }
      });
    });
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
    throw new PdfError("Error processing PDF", 500);
  }
};

export const hasValidPrefix = (value: string) => {
  try {
    if (!PREFIXES) throw new Error("Prefix table is empty, please populate it and restart server");

    return PREFIXES.some((entry) => value.toLowerCase().startsWith(entry.prefix.toLowerCase()));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const getTableData = async (table: string[][]): Promise<PurchaseOrderData> => {
  const data: PurchaseOrderData = [];

  for (const [i, row] of table.entries()) {
    //table data is always a number for first index and index 1 is the prefix
    if (isNaN(+row[0]) || !hasValidPrefix(row[1])) continue;

    // Check quantity is a number
    if (isNaN(+row[5])) continue;

    const partNumber = row[1];
    const quantity = +row[row.length - 2];

    // get the due date from the next row
    const nextRow = table[i + 1];

    if (!nextRow || !nextRow[1]) continue;

    const description = nextRow[0];
    const dueDate = nextRow[1];

    if (!isValidDate(dueDate)) continue;

    const part: Part = {
      partNumber,
      quantity,
      dueDate: parseDate(dueDate),
      description,
    };

    data.push(part);
  }

  return data;
};
