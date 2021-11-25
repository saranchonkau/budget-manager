import { AppRequest } from "./app-request";

export interface BaseController {
  execute(appRequest: AppRequest): Promise<void>;
}
