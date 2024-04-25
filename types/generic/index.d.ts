export type Parcel = { dateReceived: number; amountReceived: number };

export type PurchaseOrder = {
  purchaseOrder: string;
  orderRef: string;
  partNumbers: {
    [key: string]: {
      name: string;
      partial: 1 | 0;
      totalOrdered: number | undefined;
      description: string;
      partsReceived: Parcel[] | undefined;
      location?: string;
    };
  };
};
export type PDFStructure = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
export type Log =
  | "login"
  | "logout"
  | "validateToken"
  | "updateLocation"
  | "isPrefixValid"
  | "addPrefix";
