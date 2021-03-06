import path from "node:path";
import { readFile } from "node:fs/promises";
import knex from "../knex/knex-instance.js";
import { resolveRootFilePath } from "@/scripts/internal/paths";

const seedsDirPath = resolveRootFilePath("./db/seeds");

async function execSqlFromSeedFile(file: string) {
  const absolutePath = path.join(seedsDirPath, file);

  const sqlBuffer = await readFile(absolutePath);
  return knex.raw(sqlBuffer.toString());
}

console.log("Running...");
execSqlFromSeedFile("populate-db.sql")
  .then(
    () => {
      console.log("Finished!");
    },
    (error) => {
      console.error("[Error]", error);
    }
  )
  .finally(() => {
    process.exit();
  });
