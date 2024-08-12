import { NewUser } from "./types";
import { ServerResponse } from "http";

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  message?: unknown
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(message));
};

export const handleError = (res: ServerResponse, error: unknown) => {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    sendResponse(res, 400, { message: error.message });
  } else {
    console.error(`An unknown error occurred: ${String(error)}`);
    sendResponse(res, 500, { message: "Internal server error" });
  }
};

// Type guards
const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const parseDate = (value: unknown, what: string): string => {
  if (!isString(value) || !isDate(value)) {
    throw new Error(`Value of ${what} incorrect: ${String(value)}`);
  }
  return value;
};

const parseString = (value: unknown, what: string): string => {
  if (isString(value)) {
    return value;
  }
  throw new Error(`Value of ${what} incorrect: ${String(value)}`);
};

const parseEmail = (value: unknown, what: string): string => {
  if (isString(value) && isEmail(value)) {
    return value;
  }
  throw new Error(`Value of ${what} incorrect: ${String(value)}`);
};

export const parseUser = (object: unknown): NewUser => {
  if (!object || typeof object !== "object") {
    throw new Error("Data missing or in wrong format");
  }

  if (!("name" in object)) throw new Error("name missing");
  if (!("email" in object)) throw new Error("email missing");
  if (!("dateOfBirth" in object)) throw new Error("dateOfBirth missing");

  return {
    name: parseString(object.name, "name"),
    email: parseEmail(object.email, "email"),
    dateOfBirth: parseDate(object.dateOfBirth, "dateOfBirth"),
  };
};
