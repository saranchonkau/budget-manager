import { Router } from "@/router";

export interface ModuleRouter {
  init(router: Router): void;
}

export interface ModuleRouterConstructor {
  new (): ModuleRouter;
}
