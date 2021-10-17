const isDebug = process.argv[2] === "--debug";

const logger = {
  logLevel: isDebug ? "debug" : "info",
  log(...args) {
    console.log(...args);
  },
  debug(...args) {
    if (!isDebug) return;
    console.log(...args);
  },
};

module.exports = { logger };
