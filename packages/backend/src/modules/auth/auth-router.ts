import { Router } from "@/router";
import { instanceOf } from "@/ioc";
import { ModuleRouter } from "@/shared/module-router";
import { SignUpController } from "@/modules/auth/use-cases/sign-up/sign-up-controller";
import { GetProfileController } from "@/modules/auth/use-cases/get-profile/get-profile-controller";
import { AuthenticatedFilter } from "@/modules/auth/authenticated-filter";

export class AuthRouter implements ModuleRouter {
  init(router: Router) {
    router
      .post("/auth/signup", {
        controller: instanceOf(SignUpController),
      })
      .get("/auth/profile", {
        filters: [instanceOf(AuthenticatedFilter)],
        controller: instanceOf(GetProfileController),
      });
  }
}
