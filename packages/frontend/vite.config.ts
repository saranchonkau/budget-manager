import { defineConfig, searchForWorkspaceRoot } from "vite";
import * as path from "node:path";
import react from "@vitejs/plugin-react";

function resolvePath(filePath: string) {
  return path.resolve(__dirname, filePath);
}

console.log("path: ", searchForWorkspaceRoot(process.cwd()));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      /** Support TS path aliases */
      { find: /@\/(.+)/, replacement: resolvePath("src/$1") },
      /**
       * Support importing css files from `node_modules` via `~`.
       * e.g. `@import "~normalize.css";`
       */
      {
        find: /^~(.+)/,
        replacement: resolvePath("../../node_modules/$1"),
      },
    ],
  },
  // server: {
  //   fs: {
  //     strict: true,
  //     // allow: [
  //     //   // search up for workspace root
  //     //   path.join(searchForWorkspaceRoot(process.cwd()), "packages/frontend"),
  //     // ],
  //   },
  // },
});
