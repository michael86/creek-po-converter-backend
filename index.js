"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@pdfme/common");
const generator_1 = require("@pdfme/generator");
const fs = require("fs");
const path = require("path");
const fontSize = 12;
const labelWidth = 63;
const labelHeight = 47;
const sheetHeight = 297;
const sheetWidth = 210;
const sheetCols = 3;
const sheetRows = 6;
const template = {
    basePdf: common_1.BLANK_PDF,
    schemas: [
        {
            0: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 0 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            1: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 0 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            2: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 0 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            3: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 1 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            4: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 1 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            5: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 1 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            6: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 2 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            7: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 2 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            8: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 2 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            9: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 3 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            10: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 3 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            11: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 3 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            12: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 4 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            13: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 4 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            14: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 4 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            15: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 0 + 12, y: (sheetWidth / sheetCols) * 5 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            16: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 1 + 12, y: (sheetWidth / sheetCols) * 5 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
            17: {
                type: "text",
                position: { x: (sheetHeight / sheetRows) * 2 + 12, y: (sheetWidth / sheetCols) * 5 + 12 },
                width: labelWidth,
                height: labelHeight,
                alignment: "center",
                fontSize: fontSize,
            },
        },
    ],
};
const inputs = [
    {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
        11: "elleven",
        12: "twelve",
        13: "thirteen",
        14: "fourteen",
        15: "fifthteen",
        16: "sixteen",
        17: "seventeen",
        18: "eightteen",
    },
];
(0, generator_1.generate)({ template, inputs }).then((pdf) => {
    console.log(pdf);
    fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
});
//uncomment to test files
// (async () => {
//   const data = await testFiles();
//   console.log(data);
// })();
// const fontSize: number = 12;
// const labelWidth: number = 99;
// const labelHeight: number = 38;
// const sheetHeight: number = 297;
// const sheetWidth: number = 210;
// const sheetCols: number = 2;
// const sheetRows: number = 7;
// const template: Template = {
//   basePdf: BLANK_PDF,
//   schemas: [
//     {
//       0: {
//         type: "text",
//         position: { x: (sheetHeight / sheetRows) * 0, y: (sheetWidth / sheetCols) * 0 },
//         width: labelWidth,
//         height: labelHeight,
//         alignment: "center",
//         fontSize: fontSize,
//       },
//       13: {
//         type: "text",
//         position: { x: (sheetHeight / sheetRows) * 6, y: (sheetWidth / sheetCols) * 1 },
//         width: labelWidth,
//         height: labelHeight,
//         alignment: "center",
//         fontSize: fontSize,
//       },
// const inputs = [{ 0: "a", 13: "z" }];
// generate({ template, inputs }).then((pdf) => {
// console.log(pdf);
// });
