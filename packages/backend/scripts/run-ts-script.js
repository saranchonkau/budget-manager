const esbuild = require("esbuild");
const path = require("node:path");
const pc = require("picocolors");
const cp = require("node:child_process");

const scriptFileName = process.argv[2];

if (!scriptFileName) {
  console.error(pc.red("[error]: Please specify script file"));
  process.exit(1);
}

const scriptPath = path.resolve(process.cwd(), scriptFileName);

/** Reference: {@link https://github.com/evanw/esbuild/issues/619#issuecomment-751995294} */
const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    /** Must not start with "/" or "./" or "../" or "@/" */
    const filter = /^[^.\/@]|^\.[^.\/]|^\.\.[^\/]|^@[^\/]/;

    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

const ext = path.extname(scriptFileName);
const basename = path.basename(scriptFileName).slice(0, -1 * ext.length);
const outFile = path.join(__dirname, "../.tmp", basename + ".js");

let scriptProcess = null;

esbuild
  .build({
    plugins: [makeAllPackagesExternalPlugin],
    entryPoints: [scriptPath],
    outfile: outFile,
    bundle: true,
    target: "node16",
    platform: "node",
    format: "cjs",
    tsconfig: path.resolve(__dirname, "..", "tsconfig.json"),
  })
  .then(() => {
    scriptProcess = cp.fork(outFile, process.argv.slice(3), {
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
