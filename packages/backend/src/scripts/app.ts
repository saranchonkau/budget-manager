import { ChildProcess } from "child_process";
import path from "node:path";
import { fork } from "node:child_process";
import { rm } from "node:fs/promises";
import esbuild, { BuildResult, Plugin } from "esbuild";
import pc from "picocolors";
import chokidar from "chokidar";

import { logger } from "./logger.js";

const APP_DIRECTORY = "src";
const APP_ENTRY_POINT = path.join(APP_DIRECTORY, "index.ts");
const KNEX_FILE = path.resolve(APP_DIRECTORY, "./knex/knexfile.ts");
const BUILD_DIRECTORY = "dist";
const BUILD_DIRECTORY_PATH = path.resolve(__dirname, "..", BUILD_DIRECTORY);
const APP_BUILD_FILE = path.join(BUILD_DIRECTORY, "index.js");

class App {
  private appProcess: ChildProcess | null = null;

  removeDistFolder() {
    return rm(BUILD_DIRECTORY_PATH, { recursive: true, force: true });
  }

  async build<T extends BuildResult>(): Promise<T> {
    const isProduction = process.env.NODE_ENV === "production";

    const start = process.hrtime.bigint();

    await this.removeDistFolder();

    const makeAllPackagesExternalPlugin: Plugin = {
      name: "make-all-packages-external",
      setup(build) {
        let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args) => ({
          path: args.path,
          external: true,
        }));
      },
    };

    return esbuild
      .build({
        plugins: [makeAllPackagesExternalPlugin],
        entryPoints: {
          index: APP_ENTRY_POINT,
          knexfile: KNEX_FILE,
        },
        bundle: true,
        outdir: BUILD_DIRECTORY_PATH,
        target: "node16",
        platform: "node",
        // logLevel: "debug",
        format: "cjs",
        incremental: !isProduction,
      })
      .then((buildResult) => {
        const end = process.hrtime.bigint();
        logger.debug(pc.cyan(`Build took ${(end - start) / 1000_0000n}ms`));

        return buildResult as T;
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

  onChange(changeHandler: () => void): void {
    chokidar
      .watch(APP_DIRECTORY, { ignoreInitial: true })
      .on("all", changeHandler);
  }
}

export const app = new App();
