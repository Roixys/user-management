import { createServer, IncomingMessage, ServerResponse } from "http";
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  updateUserHandler,
} from "./handler";
import { User } from "./types";
import { sendResponse } from "./utils";

const PORT: number = 5000;

// local memory storage (array)
export const users: User[] = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const [, resource, id] = req.url?.split("/") || [];

  if (resource === "users") {
    switch (req.method) {
      case "POST":
        createUserHandler(req, res);
        break;
      case "GET":
        if (id) {
          getUserHandler(res, id);
        } else {
          sendResponse(res, 200, { data: users });
        }
        break;
      case "PUT":
        if (id) {
          updateUserHandler(req, res, id);
        }
        break;
      case "DELETE":
        if (id) {
          deleteUserHandler(res, id);
        }
        break;
      default:
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
        break;
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
