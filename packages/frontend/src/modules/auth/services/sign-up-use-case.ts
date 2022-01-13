import { signUp, SignUpDto } from "@/services/api";

export class SignUpUseCase {
  async signUp(payload: SignUpDto) {
    const response = await signUp(payload).then((response) => {
      console.log("response: ", response);
    });
  }
}
