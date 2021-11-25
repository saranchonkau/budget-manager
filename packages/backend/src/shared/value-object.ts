import { UnknownObject } from "../types/common";
import { shallowEqual } from "../utils/shallow-equal";

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */
export abstract class ValueObject<T extends UnknownObject> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo: ValueObject<T>): boolean {
    return shallowEqual(this.props, vo.props);
  }
}
