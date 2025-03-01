export type RegisterUser = (
  email: string,
  password: string,
  name: string
) => Promise<number | void>;
