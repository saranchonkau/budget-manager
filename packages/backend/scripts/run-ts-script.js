const esbuild = require("esbuild");
const path = require("node:path");
const pc = require("picocolors");
const { fork } = require("node:child_process");

const scriptFileName = process.argv[2];

if (!scriptFileName) {
  console.error(pc.red("[error]: Please specify script file"));
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), scriptFileName);

const APP_DIRECTORY_PATH = path.resolve(__dirname, "..", "src");
const TSCONFIG_PATH = path.resolve(__dirname, "..", "tsconfig.json");

const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => {
      if (args.path.startsWith("@/")) {
        return {
          path: path.resolve(APP_DIRECTORY_PATH, args.path.slice(2) + ".ts"),
        };
      } else {
        return {
          path: args.path,
          external: true,
        };
      }
    });
  },
};

const ext = path.extname(scriptFileName);
const basename = path.basename(scriptFileName).slice(0, -1 * ext.length);
const outFile = path.join(__dirname, "../.tmp", basename + ".js");

let scriptProcess = null;

esbuild
  .build({
    plugins: [makeAllPackagesExternalPlugin],
    entryPoints: [filePath],
    outfile: outFile,
    bundle: true,
    target: "node16",
    platform: "node",
    format: "cjs",
    tsconfig: TSCONFIG_PATH,
  })
  .then(() => {
    scriptProcess = fork(outFile, process.argv.slice(3), {
      stdio: "inherit",
    });
  });

function handleSignal() {
  if (scriptProcess) {
    scriptProcess.kill();
  }

  process.exit(1);
}

process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);

process.on("uncaughtException", (error) => {
  console.log(pc.red("uncaughtException"), error);
});
