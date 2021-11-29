import { IncomingMessage, ServerResponse } from "node:http";
import { isHttpError } from "http-errors";
import { Router } from "@/router";

class RouteNotFoundError extends Error {
  constructor(url: string) {
    super(`Cannot find route by url: "${url}"`);
    this.name = this.constructor.name;
  }
}

export class RequestHandler {
  constructor(private readonly router: Router) {}
  async handle(req: IncomingMessage, res: ServerResponse) {
    try {
      const foundRoute = this.router.find(req);

      if (foundRoute) {
        await foundRoute.handler(req, res, {}, {});
      } else {
        throw new RouteNotFoundError(req.url || "");
      }
    } catch (error) {
      console.error(error);

      let statusCode = 500;
      let message = "Unknown error";

      if (error instanceof RouteNotFoundError) {
        statusCode = 404;
        message = "API endpoint is not found";
      } else if (isHttpError(error)) {
        statusCode = error.statusCode;
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      res.statusCode = statusCode;
      res.write(message);
      res.end();
    }
  }
}
