import pdfParser from "pdf2json";
import { PdfData } from "../types/pdf";

export const extractPurchaseAndOrderRef = (text: string) => {
  const po = text.match(/Our P\.O\. No:\s*([\d]+)/);
  const order = text.match(/Order reference:\s*([\S]+)/);

  return {
    poNumber: po ? po[1].trim() : null,
    orderNumber: order ? order[1].trim() : null,
  };
};

export const extractTableData = (text: string) => {
  const lines = text.split("\n");
  const items = [];
  let capture = false;
  let tempItem: any = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    console.log("Processing Line:", line);

    // ✅ Detect table start dynamically
    if (line.includes("LineOur part number")) {
      capture = true;
      continue;
    }

    if (capture) {
      // ✅ Ensure we have a valid row with numbers
      const hasNumbers = /\d/.test(line);
      if (!hasNumbers) continue;

      // ✅ Manually extract each value using precise positioning
      const parts = line.match(/^(\d+)?([A-Z\d]+)\D+([\d,.]+)\D+([\d,.]+)\D+([\d,.]+)\D+([\d,.]+)/);

      if (parts) {
        let partNumber = parts[2]; // ✅ Extract correct part number
        let dueQuantity = parts[4]; // ✅ Extract **FOURTH** number (correct position)

        // ✅ Fix part number if it's merged with extra text
        partNumber = partNumber.replace(/REEL.*$/, "").trim();

        // ✅ Ensure `dueQuantity` is correctly formatted
        dueQuantity = dueQuantity.replace(/^0+/, "").replace(",", ".");

        tempItem = {
          partNumber,
          dueQuantity,
          deliveryDueDate: null, // ✅ Placeholder for date
        };
      }

      // ✅ Look ahead for a separate date line
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && /\d{2}\/\d{2}\/\d{4}/.test(nextLine)) {
        tempItem.deliveryDueDate = nextLine;
        items.push(tempItem);
        tempItem = {}; // Reset for next row
      }
    }
  }

  console.log("Extracted Items:", items);
  return items;
};

export const extractDataFromPDF = (extractedText: string[]) => {
  let purchaseOrderNumber: string | null = null;
  let orderReferenceNumber: string | null = null;
  let extractedTable: any[] = [];

  // ✅ Find the Purchase Order Number
  const poIndex = extractedText.findIndex((text) => text.includes("Our P.O. No:"));
  if (poIndex !== -1 && poIndex + 1 < extractedText.length) {
    purchaseOrderNumber = extractedText[poIndex + 1].trim();
  }

  // ✅ Find the Order Reference
  const orderRefIndex = extractedText.findIndex((text) => text.includes("Order reference:"));
  if (orderRefIndex !== -1 && orderRefIndex + 1 < extractedText.length) {
    orderReferenceNumber = extractedText[orderRefIndex + 1].trim();
  }

  // ✅ Locate the Table Start Dynamically
  let tableStartIndex = extractedText.findIndex((text) =>
    text.includes("Product description and notesDelivery due date")
  );
  if (tableStartIndex === -1) {
    console.error("❌ Table header not found.");
    return { purchaseOrderNumber, orderReferenceNumber, items: [] };
  }

  // ✅ Extract Table Data from the Rows Below the Header
  for (let i = tableStartIndex + 1; i < extractedText.length; i++) {
    let row = extractedText[i].trim();
    if (!row || row.length < 10) continue; // ✅ Skip empty or irrelevant rows

    // ✅ Ensure this is an actual data row (must contain numbers)
    if (!/\d/.test(row)) continue;

    // ✅ Extract values using improved regex
    const match = row.match(/^(\d+)\s*([A-Z\d-]+)\s*[A-Z]+\s*(\d+\.\d{4})\s*(\d+\.\d{3})/);

    if (match) {
      let partNumber = match[2]; // ✅ Extract correct part number
      let dueQuantity = match[4]; // ✅ Extract **fourth** number as quantity

      // ✅ Final Fix: Remove unwanted descriptors (REE, CHIP, SMT, EACH)
      partNumber = partNumber.replace(/\b(REE|CHIP|SMT|EACH)\b/g, "").trim();

      // ✅ Ensure `dueQuantity` is properly formatted
      dueQuantity = dueQuantity.replace(/^0+/, "").replace(",", ".");

      // attempt to find delivery date in current or next row as some pdfs have a random new line
      let deliveryDueDate =
        row.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || // Look in current row
        extractedText[i + 1]?.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || // Look in next row
        null;

      extractedTable.push({
        partNumber,
        dueQuantity,
        deliveryDueDate,
      });
    }
  }

  return {
    purchaseOrderNumber,
    orderReferenceNumber,
    items: extractedTable.filter((item) => item.partNumber && !isNaN(parseFloat(item.dueQuantity))), // ✅ Remove invalid rows
  };
};
