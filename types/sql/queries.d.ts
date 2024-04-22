//user
export type SelectEmail = (email: string) => Promise<number | void>;
export type CreateUser = (email: string, password: string) => Promise<string | void>;
export type ValidateLogin = (email: string) => Promise<string[] | void>;
export type ValidateUserToken = (email: string, token: string) => Promise<boolean | void>;
export type SetTokenToNull = (email: string, token: string) => Promise<true | void>;
export type UpdateUserToken = (email: string, token: string) => Promise<true | void>;
export type GetUserRole = (email: string) => Promise<number | void>;

//parts
export type FetchPrefixes = () => Promise<string[] | void>;
export type InsertPrefix = (prefix: string) => Promise<true | void>;

//purchase orders
export type InsertDataToDb = (data: Data) => Promise<true | "ER_DUP_ENTRY" | void>;
export type FetchPurchaseOrder = (id: string) => Promise<PurchaseOrder | void>;
export type FetchPurchaseOrders = () => Promise<string[] | void>;
export type PatchPartialStatus = (order: string, name: string) => Promise<true | void>;
export type AddParcelsToOrder = (
  parcels: number[],
  purchaseOrder: string,
  part: string
) => Promise<true | void>;
export type PurchaseOrder = {
  purchaseOrder: string;
  orderRef: string;
  partNumbers: {
    [key: string]: {
      name: string;
      quantityAwaited: number[][] | undefined;
      partial: 1 | 0;
      totalOrdered: number | undefined;
      description: string;
      partsReceived: number[] | undefined;
    };
  };
};
export type PDFStructure = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
