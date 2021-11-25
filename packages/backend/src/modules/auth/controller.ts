// export class AuthController {
//   private useCase: CreateUserUseCase;
//
//   constructor(useCase: CreateUserUseCase) {
//     this.useCase = useCase;
//   }
//
//   async signUp(appRequest: AppRequest) {
//     const body = appRequest.parseJsonBody(CreateUserDTOContract);
//
//     const result = await this.useCase.execute(body);
//
//     if (result.isLeft()) {
//       appRequest.send(new ErrorResponse(result.value));
//       return;
//     }
//
//     const user = result.value;
//
//     appRequest.send(
//       new CommandResponse({
//         message: "User successfully created",
//         data: {
//           user,
//           token: // TODO add access token
//         },
//       })
//     );
//   }
// }
