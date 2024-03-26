const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");

const pdfFolder = path.resolve(__dirname, "../public/pdf");

type Rows = string[][];

// Prefixes to match against in PDF content
const PREFIXES = [
  "econn",
  "ecapt",
  "erest",
  "einci",
  "etras",
  "etran",
  "eleds",
  "ecry",
  "esensor",
  "emodu",
  "epart",
  "efix",
  "etool",
  "epcbs",
  "ewire",
  "ecilp",
  "efuse",
  "elink",
  "erely",
  "eswtc",
  "ediod",
  "se000",
  "eindu",
  "econv",
  "ereg",
  "ether",
  "emtwk",
  "epotn",
  "esold",
  "etrim",
  "ebat",
  "epcb",
  "ecirb",
];

// Extracts relevant data from table rows
const getData = (rows: Rows) => {
  const data: string[][] = [];

  rows.forEach((row, index) => {
    const lowerCasedRow = row.map((entry) => entry.toLowerCase());
    const nextRow = rows[index + 1] || [];

    lowerCasedRow.forEach((string, stringIndex) => {
      if (shouldIncludeString(string, lowerCasedRow, stringIndex)) {
        const quantityIndex = row.length - 2;
        const quantity = Math.floor(+row[quantityIndex]).toString();
        const nextRowFirstElement = nextRow[0] || "";
        data.push([row[1], quantity, nextRowFirstElement]);
      }
    });
  });

  console.log("data ", data);

  return data;
};

const shouldIncludeString = (string: string, row: string[], index: number): boolean => {
  return PREFIXES.some(
    (prefix) => string.includes(prefix) && row[1] !== "stencil" && row.length > 4
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
