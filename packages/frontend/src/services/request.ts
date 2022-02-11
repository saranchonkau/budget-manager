import {
  BodyParam,
  HttpMethod,
  HttpRequestFunction,
  RequestOptions,
} from "@/typings/request";
import type { Nullable, QueryParams } from "@/typings/common";
import { isNotNullish } from "@/utils/common";
import { convertParamsToString } from "@/utils/convert-params-to-string";
import { RequestError } from "./request-error";

export const ACCESS_TOKEN_KEY = "access-token";

export class ApiService {
  readonly baseUrl = import.meta.env.VITE_APP_API_URL;

  public getAccessToken(): Nullable<string> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private configureHeaders(body?: BodyParam): Headers {
    const headers = new Headers();

    const isFormData = body instanceof FormData;
    if (!isFormData) {
      headers.append("Content-Type", "application/json");
    }

    const accessToken = this.getAccessToken();

    if (accessToken) {
      headers.append("Authorization", `Bearer ${accessToken}`);
    }

    headers.append("Accept", "application/json");

    return headers;
  }

  private configureBody(body?: BodyParam) {
    if (!body) return null;

    if (body instanceof FormData) {
      return body;
    }

    return JSON.stringify(body);
  }

  private getRequestUrl(pathname = "", queryParams?: QueryParams) {
    const search = convertParamsToString(queryParams);
    return [this.baseUrl, pathname, search].filter(isNotNullish).join("");
  }

  configureOptions({
    method,
    body,
    fetchOptions,
  }: {
    method: HttpMethod;
    body?: BodyParam | undefined;
    fetchOptions?: RequestInit | undefined;
  }): RequestInit {
    return {
      headers: this.configureHeaders(body),
      method,
      mode: "cors",
      body: this.configureBody(body),
      ...fetchOptions,
    };
  }

  getContent(response: Response) {
    const contentType = response.headers.get("content-type");

    if (
      contentType &&
      contentType.toLowerCase().startsWith("application/json")
    ) {
      return response.json();
    }

    return response.text();
  }

  handleErrors(response: Response) {
    return this.getContent(response).then((content) => {
      if (response.ok) {
        return content;
      }

      return Promise.reject(
        new RequestError({
          code: response.status,
          text: response.statusText,
        })
      );
    });
  }

  createRequest({
    method,
    path,
    body,
    params,
    absoluteUrl,
    fetchOptions,
  }: RequestOptions): Request {
    const url = absoluteUrl || this.getRequestUrl(path, params);
    const options = this.configureOptions({ method, body, fetchOptions });

    return new Request(url, options);
  }

  executeRequest(request: Request) {
    return fetch(request).then(this.handleErrors.bind(this));
  }

  bindHttpMethodToRequest(method: HttpMethod): HttpRequestFunction {
    return (options: Omit<RequestOptions, "method">) => {
      const request = this.createRequest({ ...options, method });
      return this.executeRequest(request);
    };
  }

  getRequest() {
    return {
      get: this.bindHttpMethodToRequest(HttpMethod.GET),
      post: this.bindHttpMethodToRequest(HttpMethod.POST),
      put: this.bindHttpMethodToRequest(HttpMethod.PUT),
      delete: this.bindHttpMethodToRequest(HttpMethod.DELETE),
      patch: this.bindHttpMethodToRequest(HttpMethod.PATCH),
    } as const;
  }
}

const api = new ApiService();

export const request = api.getRequest();
