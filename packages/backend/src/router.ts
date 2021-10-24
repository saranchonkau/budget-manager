import FindMyWay, { HTTPMethod } from "find-my-way";
import { IncomingMessage, ServerResponse, METHODS } from "node:http";

import { AppRequest } from "./AppRequest.js";

interface RequestHandler {
  (pattern: string, handler: (appRequest: AppRequest) => Promise<void>): Router;
}

export class Router {
  private router = FindMyWay();

  public get: RequestHandler;
  public post: RequestHandler;
  public put: RequestHandler;
  public delete: RequestHandler;

  constructor() {
    this.get = this.createHandler("GET");
    this.post = this.createHandler("POST");
    this.put = this.createHandler("PUT");
    this.delete = this.createHandler("DELETE");
  }

  public find(req: IncomingMessage) {
    if (!req.method || !req.url || !METHODS.includes(req.method)) return null;

    const method = req.method as HTTPMethod;

    console.log(method, req.url);
    return this.router.find(method, req.url);
  }

  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
    handler: (appRequest: AppRequest) => Promise<void>
  ): Promise<void> {
    const appRequest = new AppRequest(req, res);
    await appRequest.init();
    await handler(appRequest);
  }

  private createHandler(method: HTTPMethod): RequestHandler {
    return (
      pattern: string,
      handler: (appRequest: AppRequest) => Promise<void>
    ): Router => {
      this.router.on(method, pattern, (req, res) =>
        this.handleRequest(req, res, handler)
      );
      return this;
    };
  }
}
