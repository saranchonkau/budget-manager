import { AppErrorBrand } from "@/shared/app-error-brands";

export abstract class AppError<
  B extends AppErrorBrand = AppErrorBrand,
  T = undefined
> extends Error {
  readonly payload: T | undefined;
  readonly brand: B;

  protected constructor(options: { brand: B; message: string; payload?: T }) {
    super(options.message);
    this.payload = options.payload;
    this.brand = options.brand;
  }
}
