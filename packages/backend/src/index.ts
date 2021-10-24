import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as pc from "picocolors";
import { isHttpError, NotFound } from "http-errors";

import environment from "./environment.js";
import { Router } from "./router.js";
import { authController } from "./modules/auth/controller.js";

environment.init();

const router = new Router();

router.post("/auth/signup", authController.signUp);

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const foundRoute = router.find(req);

    if (foundRoute) {
      await foundRoute.handler(req, res, {}, {});
    } else {
      throw new NotFound();
    }
  } catch (error) {
    console.error(error);

    let statusCode = 500;
    let message = "Unknown error";

    if (isHttpError(error)) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    res.statusCode = statusCode;
    res.write(message);
    res.end();
  }
}

const server = createServer(handleRequest);

server.listen(8080, () => {
  console.log("Server listen port: 8080");
});

function handleSignal() {
  process.exit();
}

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);

process.on("uncaughtException", (error) => {
  console.log(pc.red("uncaughtException"), error);
});

process.on("exit", () => {
  console.log(pc.gray("App exit"));
});
