import { PurchaseOrder } from "types/generic";

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
export type InsertOrderToDb = (data: Data) => Promise<true | "ER_DUP_ENTRY" | void>;
export type FetchPurchaseOrder = (id: string) => Promise<PurchaseOrder | void>;
export type FetchPurchaseOrders = () => Promise<string[] | void>;
export type SetPartialStatus = (id: number) => Promise<true | void>;
export type AddParcelsToOrder = (parcels: number[], index: number) => Promise<true | void>;
export type RemovePartFromOrder = (id: number) => Promise<true | void>;

//SQL Select
export type SelectPoId = { id: string }[];
export type SelectOrderReferenceRelation = { order_reference: string }[];
export type SelectOrderReference = { order_reference: string }[];
export type SelectPartRelation = { part_number: string }[];
export type SelectPart = { name: string; description: string; partial_delivery: "1" | "0" }[];
export type SelectCountRelation = { receivedId: string }[];
export type SelectCount = { parcel: string }[];
export type SelectTotalOrdered = { quantity: string }[];
export type SelectAmountReceived = { amountReceived: string; dateReceived: string }[];
export type SelectDueDateRelation = { dueDate: number }[];
export type SelectDueDate = { dateDue: number }[];
export type SelectPartId = { id: string }[];
export type SelectPartial = { partial: number }[];
export type SelectPartLocationId = { location: string }[] | [];
export type SelectLocationId = { id: string }[];
export type SelectLocation = { location: string }[];
export type SelectUserId = { id: string }[];
export type SelectOrderLines = { line: number }[];
export type SelectDescription = { description: string }[];
export type SelectPartialId = { partialId: number }[];
export type SelectLineRelations = {
  partId: number;
  descId: number;
  totalOrderedId: number;
  dueDateId: number;
  partialId: number;
  locationId: number | null;
}[];
export type SelectLogs = {
  user: string;
  log: string;
  dateCreated: number;
}[];
export type SelectPoDate = { dateCreated: number }[];
