/**
 * Utility for enforcing exhaustiveness checks in the type system.
 *
 * @see https://basarat.gitbook.io/typescript/type-system/discriminated-unions#throw-in-exhaustive-checks
 *
 * @param _x The variable with no remaining values
 */
export function assertNever(_x) {
    throw new Error("Unexpected value. Should have been never.");
}
export function pick(base, keys) {
    const entries = keys.map(key => [key, base === null || base === void 0 ? void 0 : base[key]]);
    return Object.fromEntries(entries);
}
export function isObject(o) {
    return typeof o === "object" && o !== null;
}
//# sourceMappingURL=helpers.js.map