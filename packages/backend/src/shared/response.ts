import { AppError } from "@/shared/app-error";
import { AppErrorBrand } from "@/shared/app-error-brands";

export interface ResponseModel {
  readonly statusCode: number;
  readonly body: string;
}

export class QueryResponse<Data> implements ResponseModel {
  readonly statusCode: number;
  readonly body: string;

  constructor(options: { data: Data; status?: number }) {
    this.statusCode = options.status ?? 200;
    this.body = JSON.stringify({ data: options.data });
  }
}

export class CommandResponse<Data> implements ResponseModel {
  readonly statusCode: number;
  readonly body: string;

  constructor(options: { message: string; data: Data; status?: number }) {
    this.statusCode = options.status ?? 200;

    this.body = JSON.stringify({
      message: options.message,
      data: options.data,
    });
  }
}

export class ErrorResponse<B extends AppErrorBrand, P>
  implements ResponseModel
{
  readonly statusCode: number;
  readonly body: string;

  constructor(statusCode: number, error: AppError<B, P>) {
    this.statusCode = statusCode;
    this.body = JSON.stringify({
      message: error.message,
      payload: error.payload,
    });
  }
}
