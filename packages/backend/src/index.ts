import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as pc from "picocolors";
import { isHttpError, NotFound } from "http-errors";
import environment from "./environment.js";
import { AppRequest } from "./AppRequest.js";
import { userRepository } from "./modules/user/repository.js";

environment.init();

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const appRequest = new AppRequest(req, res);
    await appRequest.init();

    if (
      appRequest.url.pathname === "/auth/signup" &&
      appRequest.method === "POST"
    ) {
      const result = await userRepository.create({
        email: "john.doe4@gmail.com",
        password_hash: "some password hash",
        name: "John doe",
      });
      console.log("result", result);
      appRequest.respond(200, "User have been created");
      return;
    }

    throw new NotFound();
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
