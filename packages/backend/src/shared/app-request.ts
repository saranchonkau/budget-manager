import { IncomingMessage, ServerResponse } from "node:http";
import { URL } from "node:url";
import { OutgoingHttpHeaders } from "node:http";
import * as z from "zod";
import { parseWithContract } from "./parse-with-contract";
import { ErrorResponse, ResponseModel } from "@/shared/response";
import { AppErrorBrand } from "@/shared/app-error-brands";
import { AppError } from "@/shared/app-error";
import { Either, left, right } from "@sweet-monads/either";
import { convertZodIssuesToErrorObject } from "@/utils/convert-zod-error";
import { ZodError } from "zod";
import { UnknownObject } from "@/types/common";

export class InvalidRequestBodyError extends AppError<AppErrorBrand.InvalidRequestBody> {
  constructor() {
    super({
      brand: AppErrorBrand.InvalidRequestBody,
      message: `Invalid request body`,
    });
  }
}

export class RequestBodyDoesNotFitContractError extends AppError<
  AppErrorBrand.RequestBodyDoesNotFitContract,
  UnknownObject
> {
  constructor(zodError: ZodError) {
    super({
      brand: AppErrorBrand.RequestBodyDoesNotFitContract,
      message: `Request body doesn't fit contract`,
      payload: convertZodIssuesToErrorObject(zodError),
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

  public get isFinished(): boolean {
    return this.res.writableEnded;
  }

  public get headers() {
    return this.req.headers;
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
      return left(new RequestBodyDoesNotFitContractError(result.value));
    }

    return right(result.value);
  }

  public get method(): string {
    const method = this.req.method;

    if (!method) {
      throw new Error("Request method is empty");
    }

    return method;
  }

  public get url(): URL {
    const url = this.req.url;

    if (!url) {
      throw new Error("Request url is empty");
    }

    return new URL(url, "http://base");
  }

  public async init() {
    await this.initBody();
  }

  private async initBody() {
    const buffers = [];

    const requestStream: AsyncIterable<Buffer> = this.req;

    for await (const chunk of requestStream) {
      buffers.push(chunk);
    }

    this.body = Buffer.concat(buffers);
  }

  private applyCorsHeaders() {
    this.res.setHeader("Access-Control-Allow-Origin", "*");
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
    this.respond(response.statusCode, response.body, {
      "content-type": "application/json",
    });
  }

  respond(
    statusCode: number,
    body?: string | null,
    headers?: OutgoingHttpHeaders
  ): void {
    if (this.isFinished) {
      throw new Error("Trying to write in finished response.");
    }

    this.applyCorsHeaders();

    this.res.writeHead(statusCode, headers);

    if (body) {
      this.res.write(body);
    }

    this.res.end();
  }
}
