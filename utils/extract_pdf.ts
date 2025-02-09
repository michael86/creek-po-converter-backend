import { GetData, Rows, ShouldIncludeString } from "../types/utils";

const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");

const pdfFolder = path.resolve(__dirname, "../public/pdf");

import { fetchPrefixes } from "../db/queries/parts";

/**
 *
 * @param rows
 * @returns
 */
const getData: GetData = async (rows) => {
  const data: Rows = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const lowerCasedRow = row.map((entry) => entry.toLowerCase());
    const nextRow = rows[index + 1] || [];

    for (const string of lowerCasedRow) {
      if (await shouldIncludeString(string, lowerCasedRow)) {
        const quantityIndex = row.length - 2;
        const quantity = Math.floor(+row[quantityIndex]).toString();
        const nextRowFirstElement = nextRow[0] || "";
        const scheduled = nextRow[1] || "";
        data.push([row[1], quantity, nextRowFirstElement, scheduled]);
      }
    }
  }

  return data;
};

const shouldIncludeString: ShouldIncludeString = async (string, row) => {
  const prefixes = await fetchPrefixes();
  
  if (!prefixes) return;

  return prefixes.some(
    (prefix: string) =>
      string.toLowerCase().includes(prefix.toLowerCase()) && row[1] !== "stencil" && row.length > 4
  );
};

// Extracts order reference from table rows
const getOrderReference = (rows: Rows) => {
  let filtered = rows.filter(
    (row) => row.length === 3 && row[0].toLowerCase().includes("order refer")
  );
  console.log(`filtered ${filtered}`)
  if (!filtered[0]?.[1]) return;
  return filtered[0][1];
};

// Extracts purchase order from table rows
const getPurchaseOrder = (rows: Rows) => {
  let filtered = rows.filter((row) => row.length === 3 && row[0].toLowerCase().includes("our p.o"));
  if (!filtered[0]?.[1]) return;
  return filtered[0][1];
};

// Processes a single PDF file
export const processFile = async (file: string, cb: CallableFunction) => {
  try {
    const fileData = await fs.readFile(path.resolve(pdfFolder, file));

    pdf2table.parse(fileData, async function (err: string, rows: Rows) {
      if (err) throw new Error(`pdf2table ${err}`);

      const DATA = await getData(rows);
      console.log(`DATA ${DATA}`)
      const ORDER_REFERENCE = getOrderReference(rows);
      console.log(`ORDER_REFERENCE ${ORDER_REFERENCE}`)

      const PURCHASE_ORDER = getPurchaseOrder(rows);
      console.log(`PURCHASE_ORDER ${PURCHASE_ORDER}`)

      if (!ORDER_REFERENCE || !PURCHASE_ORDER) {
        cb(null);
        return;
      }

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
