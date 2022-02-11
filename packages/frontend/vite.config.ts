import { defineConfig, searchForWorkspaceRoot } from "vite";
import * as path from "node:path";
import react from "@vitejs/plugin-react";

const workspaceRoot = searchForWorkspaceRoot(process.cwd());

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      /** Support TS path aliases */
      { find: /@\/(.+)/, replacement: path.resolve(__dirname, "src/$1") },
      /**
       * Support importing css files from `node_modules` via `~`.
       * e.g. `@import "~normalize.css";`
       */
      {
        find: /^~(.+)/,
        replacement: path.resolve(workspaceRoot, "node_modules/$1"),
      },
    ],
  },
  server: {
    fs: {
      strict: true,
      allow: [path.join(workspaceRoot, "packages/frontend")],
    },
  },
});
