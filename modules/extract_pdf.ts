const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");
const pdfFolder = path.resolve(__dirname, "../public/pdf");

type Rows = string[][];

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

const getData = (rows: Rows) => {
  const data: string[][] = [];

  rows.forEach((row) => {
    row.forEach((string) => {
      PREFIXES.forEach((prefix) => {
        string = string.toLowerCase();
        if (string.includes(prefix) && row[1]?.toLowerCase() !== "stencil") {
          row.length > 4 && data.push([row[1], Math.floor(+row[row.length - 2]).toString()]);
        }
      });
    });
  });

  return data;
};

const getOrderReference = (rows: Rows) => {
  let filtered = rows.filter(
    (row) => row.length === 3 && row[0].toLowerCase().includes("order refer")
  );

  if (!filtered[0][1]) throw new Error("failed to get order reference");
  return filtered[0][1];
};

const getPurchaseOrder = (rows: Rows) => {
  let filtered = rows.filter((row) => row.length === 3 && row[0].toLowerCase().includes("our p.o"));
  if (!filtered[0][1]) throw new Error("failed to get P.O");
  return filtered[0][1];
};

export const processFile = async (file: string, cb: CallableFunction) => {
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
};

type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
export const testFiles = async () => {
  const dir = await fs.readdir(pdfFolder);
  const retval: Data[] = [];
  for (const file of dir) {
    await processFile(file, (data: Data) => {
      if (data) retval.push(data);
    });
  }

  return retval;
};
