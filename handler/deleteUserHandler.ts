import { ServerResponse } from "http";
import { handleError, sendResponse } from "../utils";
import { users } from "..";

export const deleteUserHandler = (res: ServerResponse, id: string) => {
  try {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      sendResponse(res, 204);
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
};
