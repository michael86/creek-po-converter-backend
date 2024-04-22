// import PurchaseOrder

export type SelectEmail = (email: string) => Promise<number | void>;
export type CreateUser = (email: string, password: string) => Promise<string | void>;
export type ValidateLogin = (email: string) => Promise<string[] | void>;
export type ValidateUserToken = (email: string, token: string) => Promise<boolean | void>;
export type SetTokenToNull = (email: string, token: string) => Promise<true | void>;
export type UpdateUserToken = (email: string, token: string) => Promise<true | void>;
export type GetUserRole = (email: string) => Promise<number | void>;

export type Queries = {
  parts: {
    fetchPrefixes: () => Promise<string[] | void>;
    insertPrefix: (prefix: string) => Promise<true | void>;
  };
  purchaseOrders: {
    //Rename insert data to db
    insertDataToDb: (data: Data) => Promise<true | "ER_DUP_ENTRY" | void>;
    fetchPurchaseOrders: () => Promise<string[] | void>;
    fetchPurchaseOrder: (id: string) => Promise<PurchaseOrder | void>;
    patchPartialStatus: (order: string, name: string) => Promise<true | void>;
    addParcelsToOrder: (
      parcels: number[],
      purchaseOrder: string,
      part: string
    ) => Promise<true | void>;
  };
};
