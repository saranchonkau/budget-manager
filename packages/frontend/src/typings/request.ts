import { QueryParams } from "./common";

export type BodyParam = { [key: string]: any };

export type JsonParseResult =
  | { [key: string]: any }
  | Array<any>
  | number
  | boolean
  | null;

export type ParsedResponseBody = JsonParseResult | string | null;

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export type RequestOptions = {
  path?: string;
  body?: BodyParam;
  params?: QueryParams;
  absoluteUrl?: string;
  fetchOptions?: RequestInit | undefined;
  method: HttpMethod;
};

export type HttpRequestFunction = <T = ParsedResponseBody>(
  options: Omit<RequestOptions, "method">
) => Promise<T>;

export type ValidationError = { code: string; message: string };
