import knexFactory from "knex";
import knexConfig from "./knexfile.js";
import pg from "pg";
import { builtins } from "pg-types";

pg.types.setTypeParser(builtins.TIMESTAMPTZ, (val) => val);

const knex = knexFactory(knexConfig);

export default knex;
