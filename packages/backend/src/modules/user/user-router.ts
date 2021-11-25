import { Router } from "@/router";
import { injector } from "@/ioc";
import { CreateUserController } from "@/modules/user/use-cases/create-user/create-user-controller";
import { ModuleRouter } from "@/shared/module-router";

export class UserRouter implements ModuleRouter {
  init(router: Router) {
    router.post("/auth/signup", (appRequest) =>
      injector.injectClass(CreateUserController).execute(appRequest)
    );
  }
}
