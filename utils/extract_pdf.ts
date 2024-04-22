import { GetData, Rows, ShouldIncludeString } from "../types/utils";

const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");

const pdfFolder = path.resolve(__dirname, "../public/pdf");

const { fetchPrefixes } = require("../sql/queries");

/**
 *
 * @param rows
 * @returns
 */
const getData: GetData = (rows) => {
  const data: Rows = [];

  rows.forEach((row, index) => {
    const lowerCasedRow = row.map((entry) => entry.toLowerCase());
    const nextRow = rows[index + 1] || [];

    lowerCasedRow.forEach((string) => {
      if (shouldIncludeString(string, lowerCasedRow)) {
        const quantityIndex = row.length - 2;
        const quantity = Math.floor(+row[quantityIndex]).toString();
        const nextRowFirstElement = nextRow[0] || "";
        data.push([row[1], quantity, nextRowFirstElement]);
      }
    });
  });

  return data;
};

const shouldIncludeString: ShouldIncludeString = (string, row) => {
  const prefixes = fetchPrefixes();
  return prefixes.some(
    (prefix: string) => string.includes(prefix) && row[1] !== "stencil" && row.length > 4
  );
};

// Extracts order reference from table rows
const getOrderReference = (rows: Rows) => {
  let filtered = rows.filter(
    (row) => row.length === 3 && row[0].toLowerCase().includes("order refer")
  );

  if (!filtered[0]?.[1]) throw new Error("Failed to get order reference");
  return filtered[0][1];
};

// Extracts purchase order from table rows
const getPurchaseOrder = (rows: Rows) => {
  let filtered = rows.filter((row) => row.length === 3 && row[0].toLowerCase().includes("our p.o"));
  if (!filtered[0]?.[1]) throw new Error("Failed to get P.O");
  return filtered[0][1];
};

// Processes a single PDF file
export const processFile = async (file: string, cb: CallableFunction) => {
  try {
    const fileData = await fs.readFile(path.resolve(pdfFolder, file));
    pdf2table.parse(fileData, function (err: string, rows: Rows) {
      if (err) return console.log(err);

      const DATA = getData(rows);
      const ORDER_REFERENCE: string = getOrderReference(rows);
      const PURCHASE_ORDER: string = getPurchaseOrder(rows);

      if (DATA.length) {
        cb({
          DATA,
          ORDER_REFERENCE,
          PURCHASE_ORDER,
        });
        return;
      }

      cb(null);
    });
  } catch (error) {
    console.error(`Error processing file ${file}: `, error);
    cb(null);
  }
};

// Processes all PDF files in the directory

type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
export const testFiles = async () => {
  try {
    const dir = await fs.readdir(pdfFolder);
    const retval: Data[] = [];

    for (const file of dir) {
      await processFile(file, (data: Data) => {
        if (data) retval.push(data);
      });
    }

    return retval;
  } catch (error) {
    console.error("Error reading PDF files: ", error);
    return [];
  }
};
