import FindMyWay, { HTTPMethod } from "find-my-way";
import { IncomingMessage, ServerResponse, METHODS } from "node:http";

import { AppRequest } from "@/shared/app-request";
import { ModuleRouterConstructor } from "@/shared/module-router";
import { Controller } from "@/shared/controller";
import {
  RequestFilter,
  RequestFilterResult,
} from "@/shared/base-request-filter";

interface RequestHandler {
  (pattern: string, handler: (appRequest: AppRequest) => Promise<void>): Router;
  (
    pattern: string,
    options: {
      filters?: Array<RequestFilter>;
      controller: Controller;
    }
  ): Router;
}

export class Router {
  private router = FindMyWay();

  public get: RequestHandler;
  public post: RequestHandler;
  public put: RequestHandler;
  public delete: RequestHandler;
  public options: RequestHandler;

  constructor() {
    this.get = this.createHandler("GET");
    this.post = this.createHandler("POST");
    this.put = this.createHandler("PUT");
    this.delete = this.createHandler("DELETE");
    this.options = this.createHandler("OPTIONS");
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

  private async runFilters(
    filters: Array<RequestFilter>,
    appRequest: AppRequest
  ): Promise<RequestFilterResult> {
    for (let requestFilter of filters) {
      const result = await requestFilter.filter(appRequest);
      if (!result.isPassed) return result;
    }

    return { isPassed: true };
  }

  private createHandler(method: HTTPMethod): RequestHandler {
    return (pattern, handler): Router => {
      this.router.on(method, pattern, (req, res) =>
        this.handleRequest(req, res, async (appRequest) => {
          if (typeof handler === "function") {
            await handler(appRequest);
          } else {
            const { controller, filters = [] } = handler;
            const filterResult = await this.runFilters(filters, appRequest);
            if (!filterResult.isPassed) return;

            await controller.execute(appRequest);
          }
        })
      );
      return this;
    };
  }

  useModuleRouter<R extends ModuleRouterConstructor>(ModuleRouter: R): Router {
    const moduleRouter = new ModuleRouter();
    moduleRouter.init(this);
    return this;
  }
}

export const router = new Router();
