import * as t from "io-ts";
import bcrypt from "bcrypt";
import { userRepository } from "../user/user.repository";

import { AppRequest } from "../../AppRequest.js";
import createHttpError from "http-errors";
import { User } from "../user/domain/user";

const SignUpBodyContract = t.type({
  name: t.string,
  email: t.string,
  password: t.string,
});

export class AuthController {
  async signUp(appRequest: AppRequest) {
    const body = appRequest.parseJsonBody(SignUpBodyContract);
    console.log("body: ", body);

    const foundUser = await userRepository.getByEmail(body.email);

    if (foundUser) {
      throw createHttpError(
        400,
        `User with email '${body.email}' is already exists`
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = User.create(body);
    await userRepository.create(user);

    appRequest.respond(
      200,
      `User { id: ${user.id.toValue()} } have been created`
    );
  }
}
