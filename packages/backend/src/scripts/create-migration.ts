import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";

console.log("process.argv", process.argv);

const migrationName = process.argv[2];

if (!migrationName) {
  console.error(pc.red("[error]: Please specify migration name"));
  process.exit(1);
}

function normalizeNumber(num: number) {
  if (num >= 0 && num < 10) {
    return "0" + String(num);
  }

  return String(num);
}

function getDirectoryName() {
  const now = new Date();
  const timestamp = [
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getSeconds(),
  ]
    .map(normalizeNumber)
    .join("");

  return `${timestamp}_${migrationName}`;
}

function createDir() {
  const dirName = getDirectoryName();
  const dirPath = path.resolve(__dirname, "../db/migrations", dirName);
  fs.mkdirSync(dirPath);
  return dirPath;
}

const directoryPath = createDir();

fs.writeFileSync(path.join(directoryPath, "./up.sql"), "");
fs.writeFileSync(path.join(directoryPath, "./down.sql"), "");
