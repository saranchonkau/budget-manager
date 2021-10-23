const path = require("node:path");
const { fork } = require("node:child_process");
const { rm } = require("node:fs/promises");
const esbuild = require("esbuild");
const pc = require("picocolors");
const chokidar = require("chokidar");
const { logger } = require("./logger.js");

const APP_DIRECTORY = "src";
const APP_ENTRY_POINT = path.join(APP_DIRECTORY, "index.ts");
const KNEX_FILE = path.resolve(APP_DIRECTORY, "./knex/knexfile.ts");
const RUN_SEEDS_SCRIPT = path.join(APP_DIRECTORY, "./knex/run-seeds.ts");
const BUILD_DIRECTORY = "dist";
const BUILD_DIRECTORY_PATH = path.resolve(__dirname, "..", BUILD_DIRECTORY);
const APP_BUILD_FILE = path.join(BUILD_DIRECTORY, "index.js");

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
        entryPoints: {
          index: APP_ENTRY_POINT,
          knexfile: KNEX_FILE,
          "run-seeds": RUN_SEEDS_SCRIPT,
        },
        bundle: true,
        outdir: BUILD_DIRECTORY_PATH,
        target: "node16",
        platform: "node",
        logLevel: "debug",
        format: "cjs",
        incremental: !isProduction,
        external: ["knex"],
      })
      .then((buildResult) => {
        const end = process.hrtime.bigint();
        logger.debug(pc.cyan(`Build took ${(end - start) / 1000_0000n}ms`));

        return buildResult;
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

const app = new App();

module.exports = { app };
