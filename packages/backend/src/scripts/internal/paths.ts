import path from "node:path";

/**
 * __dirname is always equal to dist folder
 */
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.resolve(rootDir, "./src");
const distDir = path.resolve(rootDir, "./dist");

export function resolveSourceFilePath(...files: string[]): string {
  return path.resolve(sourceDir, ...files);
}

export function resolveRootFilePath(...files: string[]): string {
  return path.resolve(rootDir, ...files);
}

export function resolveDistFilePath(...files: string[]): string {
  return path.resolve(distDir, ...files);
}

export const paths = {
  rootDir: rootDir,
  tsconfig: resolveRootFilePath("./tsconfig.json"),
  sourceDir: sourceDir,
  source: {
    app: resolveSourceFilePath("./index.ts"),
    knexFile: resolveSourceFilePath("./knex/knexfile.ts"),
  },
  distDir: distDir,
  dist: {
    app: resolveDistFilePath("./index.js"),
    knexFile: resolveDistFilePath("./knexfile.js"),
  },
} as const;
