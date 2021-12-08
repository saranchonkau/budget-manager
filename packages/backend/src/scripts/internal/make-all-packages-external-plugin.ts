import { Plugin } from "esbuild";

/** Reference: {@link https://github.com/evanw/esbuild/issues/619#issuecomment-751995294} */
export const makeAllPackagesExternalPlugin: Plugin = {
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
