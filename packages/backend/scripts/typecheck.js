const { spawn } = require("child_process");
const chalk = require("chalk");
const { logger } = require("./logger");

function runTypechecking() {
  const child = spawn("tsc", ["--watch", "--incremental", "--noEmit"], {
    stdio: "pipe",
  });

  function handleTsMessage(data) {
    let str = data.toString();

    if (str.endsWith("\n")) {
      str = str.slice(0, -1 * "\n".length);
    }

    if (str.startsWith("")) {
      return;
    }

    if (str.includes("error TS")) {
      logger.log(chalk.redBright(str));
    } else {
      if (logger.logLevel === "info") {
        if (str.includes("Starting compilation in watch mode")) return;
        if (str.includes("Found 0 errors")) return;
        if (str.includes("File change detected")) return;
      }

      logger.log(chalk.cyan(str));
    }
  }

  child.on("data", handleTsMessage);
  child.stdout.on("data", handleTsMessage);
  child.stderr.on("data", handleTsMessage);

  return child;
}

module.exports = {
  runTypechecking,
};
