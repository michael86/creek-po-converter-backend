export type Parcel = { dateReceived: number; amountReceived: number };

export type PurchaseOrder = {
  dateCreated: number;
  purchaseOrder: string;
  orderRef: string;
  partNumbers: {
    [key: string]: {
      dateDue: string;
      name: string;
      partial: 1 | 0;
      totalOrdered: number | undefined;
      description: string;
      partsReceived: Parcel[] | undefined;
      location?: string;
    };
  };
};
export type AddParcelBody = { parcels: number[]; purchaseOrder: string; part: string };
export type PDFStructure = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
export type Log =
  | "login"
  | "logout"
  | "validateToken"
  | "updateLocation"
  | "isPrefixValid"
  | "addPrefix"
  | "fileUpload"
  | "fetchPo"
  | "setPartial"
  | "addParcel";
