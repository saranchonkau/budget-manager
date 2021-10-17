import { Knex } from "knex";
import { SqlMigrationSource } from "./migration-source.js";

interface AppKnexEnvConfig extends Knex.Config {
  client: "pg";
  connection: Knex.PgConnectionConfig;
}

interface KnexConfig {
  development: AppKnexEnvConfig;
  production: AppKnexEnvConfig;
}

const migrationSource = new SqlMigrationSource();

const migrationsConfig: Knex.MigratorConfig = {
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
