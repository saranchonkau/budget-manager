import pc from "picocolors";
import { runTypechecking } from "./typecheck.js";
import { logger } from "./logger.js";
import { app } from "./app.js";
import { BuildIncremental } from "esbuild";

const tsProcess = runTypechecking();

let buildStatus = "idle";
let bundle: BuildIncremental | null = null;
let isRebuildExpected = false;

function buildApp() {
  buildStatus = "building";

  return app
    .build<BuildIncremental>()
    .then((buildResult) => {
      buildStatus = "success";

      logger.log(pc.green("[builder] starting `node ./src/index.ts`"));
      app.start();
      bundle = buildResult;

      if (isRebuildExpected) {
        rebuildApp();
      }
    })
    .catch((error) => {
      buildStatus = "failure";
      logger.log(pc.red(`[builder] build failed `));
      console.log(error);
      app.stop();
    })
    .finally(() => {
      logger.log(pc.green("[builder] waiting for changes..."));
    });
}

function rebuildApp() {
  if (!bundle) return;

  logger.log(pc.green("[builder] rebuilding due to changes..."));

  isRebuildExpected = false;

  const start = process.hrtime.bigint();

  buildStatus = "re-building";

  return bundle
    .rebuild()
    .then(() => {
      buildStatus = "success";

      const end = process.hrtime.bigint();
      logger.debug(pc.green(`Rebuild took ${(end - start) / 1000_0000n}ms`));

      logger.log(pc.green("[builder] starting `node ./src/index.ts`"));

      app.restart();
    })
    .catch(() => {
      logger.log(pc.red("[builder] rebuild is failed"));
    })
    .finally(() => {
      logger.log(pc.green("[builder] waiting for changes..."));
    });
}

buildApp();

app.onChange(() => {
  if (["idle", "building", "re-building"].includes(buildStatus)) {
    isRebuildExpected = true;
  }

  if (bundle) {
    rebuildApp();
  } else {
    buildApp();
  }
});

function handleProcessEvent() {
  process.exit();
}

process.on("SIGINT", handleProcessEvent);
process.on("SIGTERM", handleProcessEvent);

process.on("exit", () => {
  app.stop();
  tsProcess.kill();
  logger.log(pc.red("[builder] exiting..."));
});
