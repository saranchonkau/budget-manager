/// <reference types="node" />

/**
 * Source:
 * https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/lib/react-app.d.ts
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string | undefined;
    readonly DATABASE_NAME: string | undefined;
    readonly DATABASE_USER: string | undefined;
    readonly DATABASE_PASSWORD: string | undefined;
  }
}