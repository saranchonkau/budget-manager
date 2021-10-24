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

const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const basename = path.basename(scriptFileName);
const outFile = path.join(__dirname, "../.tmp", basename);

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
  })
  .then(() => {
    scriptProcess = fork(outFile, { stdio: "inherit" });
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
