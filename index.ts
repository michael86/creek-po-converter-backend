var pdf2table = require("pdf2table");
var fs = require("fs");

type Rows = string[][];

const PREFIXES = ["econn", "efix"];

const getData = (rows: Rows) => {
  const data: string[][] = [];

  rows.forEach((row) => {
    row.forEach((string) => {
      PREFIXES.forEach((prefix) => {
        if (string.toLowerCase().includes(prefix))
          data.push([row[1], Math.floor(+row[row.length - 2]).toString()]);
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

fs.readFile("./pdf/multiple_rows.pdf", function (err: any, buffer: any) {
  if (err) return console.log(err);

  pdf2table.parse(buffer, function (err: string, rows: Rows) {
    if (err) return console.log(err);

    const DATA = getData(rows);
    const ORDER_REFERENCE: string = getOrderReference(rows);
    console.log(DATA);
    console.log(ORDER_REFERENCE);
  });
});
