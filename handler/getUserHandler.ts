import { ServerResponse } from "http";
import { handleError, sendResponse } from "../utils";
import { users } from "..";

export const getUserHandler = (res: ServerResponse, id: string) => {
  try {
    const user = users.find((u) => u.id === id);

    if (user) {
      sendResponse(res, 200, { data: user });
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
};
