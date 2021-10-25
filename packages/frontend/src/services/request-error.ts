export class RequestError extends Error {
  status: { code: number; text: string };

  constructor(status: { code: number; text: string }) {
    super(JSON.stringify({ status }, null, 2));
    this.status = status;
  }
}
