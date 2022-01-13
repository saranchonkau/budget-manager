import { request } from "@/services/request";

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export function signUp(payload: SignUpDto) {
  return request.post({
    path: "/auth/signup",
    body: payload,
  });
}
