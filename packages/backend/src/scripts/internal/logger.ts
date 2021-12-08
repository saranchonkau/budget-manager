const isDebug = process.argv[2] === "--debug";

export const logger = {
  logLevel: isDebug ? "debug" : "info",
  log(...args: any[]) {
    console.log(...args);
  },
  debug(...args: any[]) {
    if (!isDebug) return;
    console.log(...args);
  },
};
