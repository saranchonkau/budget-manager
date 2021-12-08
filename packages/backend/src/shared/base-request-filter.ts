import { AppRequest } from "@/shared/app-request";

export interface RequestFilterResult {
  isPassed: boolean;
}

export interface RequestFilter {
  filter(appRequest: AppRequest): Promise<RequestFilterResult>;
}

export abstract class BaseRequestFilter implements RequestFilter {
  protected passed(): RequestFilterResult {
    return { isPassed: true };
  }

  protected failed(appRequest: AppRequest): RequestFilterResult {
    return { isPassed: false };
  }

  abstract filter(appRequest: AppRequest): Promise<RequestFilterResult>;
}
