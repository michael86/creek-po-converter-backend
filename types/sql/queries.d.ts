// import PurchaseOrder

export type Queries = {
  fetchPrefixes: () => Promise<string[] | void>;
  insertPrefix: (prefix: string) => Promise<true | void>;
  insertDataToDb: (data: Data) => Promise<true | "ER_DUP_ENTRY" | void>;
  fetchPurchaseOrders: () => Promise<string[] | void>;
  fetchPurchaseOrder: (id: string) => Promise<PurchaseOrder | void>;
  selectEmail: (email: string) => Promise<number | void>;
  createUser: (email: string, password: string) => Promise<string | void>;
  validateLogin: (email: string) => Promise<string[] | void>;
  validateUserToken: (email: string, token: string) => Promise<boolean | void>;
  setTokenToNull: (email: string, token: string) => Promise<true | void>;
  updateUserToken: (email: string, token: string) => Promise<true | void>;
  patchPartialStatus: (order: string, name: string) => Promise<true | void>;
  addParcelsToOrder: (
    parcels: number[],
    purchaseOrder: string,
    part: string
  ) => Promise<true | void>;
  getUserRole: (email: string) => Promise<number | void>;
};
