import { Knex } from "knex";
import PgConnectionConfig = Knex.PgConnectionConfig;
import Config = Knex.Config;
import { URL } from "url";
import MigratorConfig = Knex.MigratorConfig;
import { SqlMigrationSource } from "./migration-source.js";

const migrationsDirRelativePath = "../db/migrations";

export const migrationsDirPath = new URL(
  migrationsDirRelativePath,
  import.meta.url
);

interface AppKnexEnvConfig extends Config {
  client: "pg";
  connection: PgConnectionConfig;
}

interface KnexConfig {
  development: AppKnexEnvConfig;
  production: AppKnexEnvConfig;
}

const migrationSource = new SqlMigrationSource();

const migrationsConfig: MigratorConfig = {
  migrationSource: migrationSource,
};

const knexConfig: KnexConfig = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "1234567",
      database: "budget-manager",
    },
    migrations: migrationsConfig,
  },
  production: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "1234567",
      database: "budget-manager",
    },
    migrations: migrationsConfig,
  },
};

export default knexConfig;
