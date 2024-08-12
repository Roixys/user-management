import { IncomingMessage, ServerResponse } from "http";
import { handleError, sendResponse, parseUser } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { User, NewUser } from "../types";
import { users } from "..";

export const createUserHandler = (
  req: IncomingMessage,
  res: ServerResponse
) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    processRequest(body, res);
  });
};

const processRequest = (body: string, res: ServerResponse) => {
  try {
    const newUser = parseUser(JSON.parse(body));
    const addedUser = createUser(newUser);
    users.push(addedUser);

    sendResponse(res, 201, { data: addedUser });
  } catch (error) {
    handleError(res, error);
  }
};

const createUser = (user: NewUser): User => {
  return { id: uuidv4(), ...user };
};
