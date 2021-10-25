import { IncomingMessage, ServerResponse } from "node:http";
import getStream from "get-stream";
import createHttpError from "http-errors";
import { URL } from "node:url";
import { OutgoingHttpHeaders } from "http";

export class AppRequest {
  private body: unknown;

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}

  public getBody<T>(): T {
    return this.body as T;
  }

  public get method(): string {
    const method = this.req.method;

    if (!method) {
      throw createHttpError(500, "Request method is empty");
    }

    return method;
  }

  public get url(): URL {
    const url = this.req.url;

    if (!url) {
      throw createHttpError(500, "Request url is empty");
    }

    return new URL(url, "http://base");
  }

  public async init() {
    await this.initBody();
  }

  private isBodyExpected(): boolean {
    const methodsWithBody = ["POST", "PUT", "PATCH"];
    const contentType = this.req.headers["content-type"] || "";

    return (
      methodsWithBody.includes(this.req.method || "") &&
      contentType.includes("application/json")
    );
  }

  private async initBody() {
    if (this.isBodyExpected()) {
      const json = await getStream(this.req);
      console.log("json: ", json);
      try {
        this.body = JSON.parse(json);
      } catch (error) {
        throw createHttpError(500, "Request body parsing failed");
      }
    }
  }

  private applyCorsHeaders() {
    this.res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    this.res.setHeader("Access-Control-Allow-Credentials", "true");
    this.res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    this.res.setHeader("Access-Control-Allow-Headers", "content-type");
  }

  respond(
    statusCode: number,
    body?: string | null,
    headers?: OutgoingHttpHeaders
  ): void {
    this.applyCorsHeaders();

    this.res.writeHead(statusCode, headers);

    if (body) {
      this.res.write(body);
    }

    this.res.end();
  }
}
