import { IncomingMessage, ServerResponse } from "http";
import { handleError, sendResponse, parseUser } from "../utils";
import { User, NewUser } from "../types";
import { users } from "..";

export const updateUserHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  let body: string = "";

  req.on("data", (chunk: string) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    processRequest(res, body, userId);
  });
};

const processRequest = (res: ServerResponse, body: string, userId: string) => {
  try {
    const userUpdates = parseUser(JSON.parse(body));
    const updatedUser = updateUser(userId, userUpdates);

    if (updatedUser) {
      sendResponse(res, 200, { data: updatedUser });
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const updateUser = (userId: string, userUpdates: NewUser): User | null => {
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = { ...users[userIndex], ...userUpdates };
  users[userIndex] = updatedUser;

  return updatedUser;
};
