import { createServer } from "node:http";
import * as pc from "picocolors";

import { UserRouter } from "@/modules/user/user-router";
import { AuthRouter } from "@/modules/auth/auth-router";
import { RequestHandler } from "@/request-handler";

import environment from "./environment";
import { Router } from "./router";

environment.init();

const router = new Router();

router
  .options("*", async (appRequest) => {
    appRequest.respond(204, null, {
      "Content-Length": "0",
    });
  })
  .useModuleRouter(AuthRouter)
  .useModuleRouter(UserRouter);

const requestHandler = new RequestHandler(router);
const server = createServer((req, res) => requestHandler.handle(req, res));

server.listen(environment.port, () => {
  console.log("Server listen port: ", environment.port);
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
