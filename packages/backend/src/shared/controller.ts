import { AppRequest } from "./app-request";

export interface Controller {
  execute(appRequest: AppRequest): Promise<void>;
}
