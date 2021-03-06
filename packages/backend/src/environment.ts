import dotenv from "dotenv";
import path from "node:path";

interface DatabaseEnv {
  name: string;
  user: string;
  password: string;
}

export interface Environment {
  database: DatabaseEnv;
  jwtSecret: string;
  port: number;
  isInitialized: boolean;
}

class ProjectEnvironment implements Environment {
  public database: DatabaseEnv;
  public jwtSecret: string;
  public port: number;
  public isInitialized = false;

  constructor() {
    this.database = {
      name: "",
      user: "",
      password: "",
    };
    this.jwtSecret = "";
    this.port = 9000;
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
    this.jwtSecret = process.env.JWT_SIGN_SECRET || "";
    console.log("process.env.PORT", process.env.PORT);
    this.port = Number.parseInt(process.env.PORT || "", 10) || 9000;
    console.log("port", this.port);
  }
}

const environment = new ProjectEnvironment();

export default environment;
