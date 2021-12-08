import knexFactory from "knex";
import knexConfig from "./knexfile.js";

const knex = knexFactory(knexConfig);

export default knex;
