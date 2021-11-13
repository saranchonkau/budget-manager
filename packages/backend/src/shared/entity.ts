import { UuidType } from "./uuid";

export abstract class Entity<T> {
  protected readonly _id: UuidType;
  public readonly props: T;

  protected constructor(props: T, id: UuidType) {
    this._id = id;
    this.props = props;
  }
}
