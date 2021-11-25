import { UnknownObject } from "../types/common";

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 *
 * Source: {@link https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/core/shallowEqual.js}
 */
export function shallowEqual(
  objA: UnknownObject,
  objB: UnknownObject
): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i]!;

    if (
      !Object.prototype.hasOwnProperty.call(objB, keyA) ||
      !Object.is(objA[keyA], objB[keyA])
    ) {
      return false;
    }
  }

  return true;
}
