import bcrypt from "bcrypt";
import { userRepository } from "../user/repository.js";
import { AppRequest } from "../../AppRequest.js";

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export const authController = {
  async signUp(appRequest: AppRequest) {
    const body = appRequest.getBody<SignUpBody>();

    const passwordHash = await bcrypt.hash(body.password, 10);

    const userId = await userRepository.create({
      email: body.email,
      password_hash: passwordHash,
      name: body.name,
    });

    appRequest.respond(200, `User { id: ${userId} } have been created`);
  },
};
