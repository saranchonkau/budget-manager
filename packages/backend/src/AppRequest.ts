import { IncomingMessage, ServerResponse } from "node:http";
import getStream from "get-stream";
import createHttpError from "http-errors";
import { URL } from "node:url";
import { OutgoingHttpHeaders } from "node:http";
import * as t from "io-ts";
import { Props } from "io-ts";
import { isLeft } from "fp-ts/Either";

export class AppRequest {
  private body: Buffer;

  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {
    this.body = Buffer.from("");
  }

  public getJsonBody(): string {
    return this.body.toString();
  }

  public parseJsonBody<P extends Props>(
    contract: t.TypeC<P>
  ): t.TypeOf<t.TypeC<P>> {
    let parsedBody: unknown = null;

    try {
      parsedBody = JSON.parse(this.getJsonBody());
    } catch (error) {
      throw createHttpError(500, "Request body parsing failed");
    }

    const result = contract.decode(parsedBody);

    if (isLeft(result)) {
      throw createHttpError(
        400,
        "Request body doesn't fit contract: " + result.left.toString()
      );
    }

    return result.right;
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

  private async initBody() {
    this.body = await getStream.buffer(this.req);
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
