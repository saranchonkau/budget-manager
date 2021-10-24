import { spawn } from "node:child_process";
import pc from "picocolors";
import { logger } from "./logger.js";

export function runTypechecking() {
  const child = spawn("tsc", ["--watch", "--incremental", "--noEmit"], {
    stdio: "pipe",
  });

  function handleTsMessage(data: Buffer) {
    let str = data.toString();

    if (str.endsWith("\n")) {
      str = str.slice(0, -1 * "\n".length);
    }

    if (str.startsWith("")) {
      return;
    }

    if (str.includes("error TS")) {
      logger.log(pc.red(str));
    } else {
      if (logger.logLevel === "info") {
        if (str.includes("Starting compilation in watch mode")) return;
        if (str.includes("Found 0 errors")) return;
        if (str.includes("File change detected")) return;
      }

      logger.log(pc.cyan(str));
    }
  }

  child.on("data", handleTsMessage);
  child.stdout.on("data", handleTsMessage);
  child.stderr.on("data", handleTsMessage);

  return child;
}
