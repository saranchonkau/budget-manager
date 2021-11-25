import { IncomingMessage, ServerResponse } from "node:http";
import getStream from "get-stream";
import createHttpError from "http-errors";
import { URL } from "node:url";
import { OutgoingHttpHeaders } from "node:http";
import * as z from "zod";
import { parseWithContract } from "./parse-with-contract";
import { ErrorResponse, ResponseModel } from "@/shared/response";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { AppError } from "@/shared/app-error";
import { Either, left, right } from "@sweet-monads/either";

export class InvalidRequestBodyError extends AppError<AppErrorBrand.InvalidRequestBody> {
  constructor() {
    super({
      brand: AppErrorBrand.InvalidRequestBody,
      message: `Invalid request body`,
    });
  }
}

export class RequestBodyDoesNotFitContractError extends AppError<AppErrorBrand.RequestBodyDoesNotFitContract> {
  constructor() {
    super({
      brand: AppErrorBrand.RequestBodyDoesNotFitContract,
      message: `Request body doesn't fit contract`,
    });
  }
}

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

  public parseJsonBody<T>(
    contract: z.ZodType<T>
  ): Either<
    InvalidRequestBodyError | RequestBodyDoesNotFitContractError,
    z.TypeOf<z.ZodType<T>>
  > {
    let parsedBody: unknown = null;

    try {
      parsedBody = JSON.parse(this.getJsonBody());
    } catch (error) {
      return left(new InvalidRequestBodyError());
    }

    const result = parseWithContract(contract, parsedBody);

    if (result.isLeft()) {
      return left(new RequestBodyDoesNotFitContractError());
    }

    return right(result.value);
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

  sendError(statusCode: number, error: AppError<AppErrorBrand, unknown>) {
    this.send(new ErrorResponse(statusCode, error));
  }

  send(response: ResponseModel) {
    this.respond(response.statusCode, response.body);
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
