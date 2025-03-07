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

export const isValidDate = (dateString: string) => {
  // check that the string matches the expected format.
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [day, month, year] = dateString.split("/").map(Number);
  // JavaScript months are 0-based, so subtract 1 from month.
  const date = new Date(year, month - 1, day);

  // Check if the date components match. This handles invalid dates like 32/13/2024.
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};
