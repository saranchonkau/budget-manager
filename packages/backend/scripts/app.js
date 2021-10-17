import esbuild from "esbuild";
import * as path from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";
import { fork } from "child_process";
import { rm } from "fs/promises";
import chokidar from "chokidar";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_DIRECTORY = "src";
const APP_ENTRY_POINT = path.join(APP_DIRECTORY, "index.ts");
const BUILD_DIRECTORY = "dist";
const BUILD_DIRECTORY_PATH = path.resolve(__dirname, "..", BUILD_DIRECTORY);
const APP_BUILD_FILE = path.join(BUILD_DIRECTORY, "server.js");

class App {
  constructor() {
    this.appProcess = null;
  }

  removeDistFolder() {
    return rm(BUILD_DIRECTORY_PATH, { recursive: true, force: true });
  }

  async build() {
    const isProduction = process.env.NODE_ENV === "production";

    const start = process.hrtime.bigint();

    await this.removeDistFolder();

    return esbuild
      .build({
        entryPoints: [APP_ENTRY_POINT],
        bundle: true,
        outfile: APP_BUILD_FILE,
        target: "node16",
        platform: "node",
        logLevel: "debug",
        incremental: !isProduction,
      })
      .then((buildResult) => {
        const end = process.hrtime.bigint();
        logger.debug(pc.cyan(`Build took ${(end - start) / 1000_0000n}ms`));

        return buildResult;
      })
      .catch(() => {
        this.stop();
        process.exit(1);
      });
  }

  start() {
    this.appProcess = fork(APP_BUILD_FILE, { stdio: "inherit" });
  }

  stop() {
    if (this.appProcess) {
      this.appProcess.kill();
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  onChange(changeHandler) {
    chokidar
      .watch(APP_DIRECTORY, { ignoreInitial: true })
      .on("all", changeHandler);
  }
}

export const app = new App();
