import { IncomingMessage, ServerResponse } from "node:http";
import getStream from "get-stream";
import createHttpError from "http-errors";
import { URL } from "node:url";
import { OutgoingHttpHeaders } from "http";

export class AppRequest {
  public body: unknown;

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}

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

  respond(
    statusCode: number,
    body?: string,
    headers?: OutgoingHttpHeaders
  ): void {
    this.res.writeHead(statusCode, headers);

    if (body) {
      this.res.write(body);
    }

    this.res.end();
  }
}
