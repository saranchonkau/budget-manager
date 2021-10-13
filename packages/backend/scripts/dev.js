const pc = require("picocolors");
const { app } = require("./app");
const { runTypechecking } = require("./typecheck");
const { logger } = require("./logger");

const tsProcess = runTypechecking();

app.build().then((bundle) => {
  logger.log(pc.green("[builder] starting `node ./src/index.ts`"));
  app.start();

  app.onChange(() => {
    logger.log(pc.green("[builder] rebuilding due to changes..."));

    const start = process.hrtime.bigint();

    bundle.rebuild().then(() => {
      const end = process.hrtime.bigint();
      logger.debug(pc.green(`Rebuild took ${(end - start) / 1000_0000n}ms`));

      logger.log(pc.green("[builder] starting `node ./src/index.ts`"));

      app.restart();
    });
  });
});

function handleProcessEvent() {
  process.exit();
}

process.on("SIGINT", handleProcessEvent);
process.on("SIGTERM", handleProcessEvent);

process.on("exit", () => {
  app.stop();
  tsProcess.kill();
  logger.log(pc.red("Dev server exit"));
});
