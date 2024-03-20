var pdf2table = require("pdf2table");
var fs = require("fs");

type Rows = string[][];

const PREFIXES = [
  "econn",
  "ecapt",
  "erest",
  "einci",
  "etras",
  "etran",
  "eleds",
  "ecrys",
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

const processFile = (file: string) => {
  fs.readFile(`./pdf/${file}`, function (err: any, buffer: any) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err: string, rows: Rows) {
      if (err) return console.log(err);

      const DATA = getData(rows);
      const ORDER_REFERENCE: string = getOrderReference(rows);
      const PURCHASE_ORDER: string = getPurchaseOrder(rows);

      if (DATA.length) {
        console.log(`\x1b[31m ORDER_REFERENCE \x1b[37m ${ORDER_REFERENCE}`);
        console.log(`\x1b[31m PURCHASE_ORDER \x1b[37m ${PURCHASE_ORDER}`);
        console.log(`\x1b[31m DATA \x1b[37m `);
        DATA.forEach((prefix, index) => {
          console.log(
            `\x1b[33m line ${index + 1}: ${prefix[0]} \x1b[35m QTY ${prefix[1]} \x1b[37m`
          );
        });
      }
    });
  });
};

const testFolder = "./pdf/";

fs.readdirSync(testFolder).forEach((file: string) => {
  processFile(file);
});
