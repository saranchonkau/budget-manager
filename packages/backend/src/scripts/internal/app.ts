import { ChildProcess } from "child_process";
import { fork } from "node:child_process";
import { rm } from "node:fs/promises";
import esbuild, { BuildResult } from "esbuild";
import pc from "picocolors";
import chokidar from "chokidar";

import { logger } from "./logger";
import { makeAllPackagesExternalPlugin } from "./make-all-packages-external-plugin";
import { paths } from "@/scripts/internal/paths";

class App {
  private appProcess: ChildProcess | null = null;

  removeDistFolder() {
    return rm(paths.distDir, { recursive: true, force: true });
  }

  async build<T extends BuildResult>(): Promise<T> {
    const isProduction = process.env.NODE_ENV === "production";

    const start = process.hrtime.bigint();

    await this.removeDistFolder();

    return esbuild
      .build({
        plugins: [makeAllPackagesExternalPlugin],
        entryPoints: {
          index: paths.source.app,
          knexfile: paths.source.knexFile,
        },
        bundle: true,
        outdir: paths.distDir,
        target: "node16",
        platform: "node",
        format: "cjs",
        incremental: !isProduction,
        tsconfig: paths.tsconfig,
        absWorkingDir: paths.distDir,
      })
      .then((buildResult) => {
        const end = process.hrtime.bigint();
        logger.debug(pc.cyan(`Build took ${(end - start) / 1000_0000n}ms`));

        return buildResult as T;
      });
  }

  start() {
    this.appProcess = fork(paths.dist.app, { stdio: "inherit" });
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
      .watch(paths.sourceDir, { ignoreInitial: true })
      .on("all", changeHandler);
  }
}

export const app = new App();
