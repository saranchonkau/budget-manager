import { userRepository } from "../user/repository.js";
import { AppRequest } from "../../AppRequest.js";

export const authController = {
  async signUp(appRequest: AppRequest) {
    const userId = await userRepository.create({
      email: "john.doe5@gmail.com",
      password_hash: "some password hash",
      name: "John doe",
    });
    appRequest.respond(200, `User { id: ${userId} } have been created`);
  },
};
