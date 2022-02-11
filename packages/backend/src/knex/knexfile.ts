import { Knex } from "knex";
import { SqlMigrationSource } from "./migration-source.js";
import environment from "../environment.js";

environment.init();

interface KnexConfig extends Knex.Config {
  client: "pg";
  connection: Knex.PgConnectionConfig;
}

const migrationSource = new SqlMigrationSource();

const migrationsConfig: Knex.MigratorConfig = {
  migrationSource: migrationSource,
};

const knexConfig: KnexConfig = {
  client: "pg",
  connection: {
    host: "budget-manager-postgres",
    port: 5432,
    user: environment.database.user,
    password: environment.database.password,
    database: environment.database.name,
  },
  migrations: migrationsConfig,
};

export default knexConfig;
