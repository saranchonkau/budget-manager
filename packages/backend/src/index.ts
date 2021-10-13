import { createServer, IncomingMessage, ServerResponse } from "http";
import * as pc from "picocolors";

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  res.write("Server is ok");
  res.end();
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

process.on("exit", () => {
  console.log(pc.gray("App exit"));
});
