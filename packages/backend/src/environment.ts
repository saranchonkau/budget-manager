import dotenv from "dotenv";
import path from "node:path";

interface DatabaseEnv {
  name: string;
  user: string;
  password: string;
}

class Environment {
  public database: DatabaseEnv;
  public isInitialized = false;

  constructor() {
    this.database = {
      name: "",
      user: "",
      password: "",
    };
  }

  public init(options?: { debug: boolean }) {
    if (this.isInitialized) return;

    const debug = Boolean(options?.debug);

    const envFilePath = path.resolve(__dirname, "../.env");
    const result = dotenv.config({ path: envFilePath, debug });
    if (debug) {
      console.log("Search env file in ", envFilePath);
      console.log(result);
    }

    this.populateEnvironment();
    this.isInitialized = true;
  }

  private populateEnvironment() {
    this.database = {
      name: process.env.DATABASE_NAME || "",
      user: process.env.DATABASE_USER || "",
      password: process.env.DATABASE_PASSWORD || "",
    };
  }
}

const environment = new Environment();

export default environment;
