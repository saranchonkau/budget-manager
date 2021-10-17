import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import { Knex } from "knex";

export const migrationsDirPath = path.resolve(__dirname, "../db/migrations");

interface MigrationSpec {
  date: Date;
  name: string;
  up: { path: string };
  down: { path: string };
}

function parseDirName(dirname: string): { date: Date; name: string } {
  const year = dirname.slice(0, 4);
  const month = dirname.slice(4, 6);
  const day = dirname.slice(6, 8);
  const hour = dirname.slice(8, 10);
  const minute = dirname.slice(10, 12);
  const second = dirname.slice(12, 14);
  const isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;

  return { date: new Date(isoDate), name: dirname.slice(18) };
}

async function execSqlFile(knex: Knex, file: string) {
  const absolutePath = path.join(fileURLToPath(migrationsDirPath), file);
  const sqlBuffer = await readFile(absolutePath);
  return knex.raw(sqlBuffer.toString());
}

export class SqlMigrationSource implements Knex.MigrationSource<MigrationSpec> {
  getMigration(migration: MigrationSpec): Knex.Migration {
    return {
      up: (knex) => execSqlFile(knex, migration.up.path),
      down: (knex) => execSqlFile(knex, migration.down.path),
    };
  }

  getMigrationName(migration: MigrationSpec): string {
    return migration.name;
  }

  async getMigrations(
    loadExtensions: readonly string[]
  ): Promise<Array<MigrationSpec>> {
    const dirents = await readdir(migrationsDirPath, { withFileTypes: true });
    return dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => ({
        ...parseDirName(dirent.name),
        up: { path: dirent.name + path.sep + "up.sql" },
        down: { path: dirent.name + path.sep + "down.sql" },
      }));
  }
}
