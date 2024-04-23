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

//SQL Select
export type SelectPoId = { id: string }[];
export type SelectOrderReferenceRelation = { order_reference: string }[];
export type SelectOrderReference = { order_reference: string }[];
export type SelectPartRelation = { part_number: string }[];
export type SelectPart = { name: string; description: string; partial_delivery: "1" | "0" }[];
export type SelectCountRelation = { count: string }[];
export type SelectCount = { amountReceived: string }[];
export type SelectTotalOrdered = { quantity: string }[];
export type SelectAmountReceived = { amountReceived: string }[];
