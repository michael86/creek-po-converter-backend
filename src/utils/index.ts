import { MySQLError } from "../types/queries";

export const isMySQLError = (error: unknown): error is MySQLError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "errno" in error &&
    "sqlState" in error
  );
};
