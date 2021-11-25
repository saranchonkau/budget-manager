import { Uuid } from "./uuid";

export abstract class Entity<T> {
  protected readonly _id: Uuid;
  protected readonly props: T;

  protected constructor(props: T, id: Uuid) {
    this._id = id;
    this.props = props;
  }
}
