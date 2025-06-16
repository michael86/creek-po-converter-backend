"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsSpecialExceptHyphen = exports.parseDate = exports.isValidDate = exports.isMySQLError = void 0;
const isMySQLError = (error) => {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "errno" in error &&
        "sqlState" in error);
};
exports.isMySQLError = isMySQLError;
const isValidDate = (dateString) => {
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
exports.isValidDate = isValidDate;
const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
};
exports.parseDate = parseDate;
const containsSpecialExceptHyphen = (str) => {
    return /[^a-zA-Z0-9\s-]/.test(str);
};
exports.containsSpecialExceptHyphen = containsSpecialExceptHyphen;
