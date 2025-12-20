/**
 * Branded ObjectId string
 * Acts like a string at runtime
 * But is NOT interchangeable with a normal string in TS
 */
export type ObjectId = string & {
  readonly __objectId: unique symbol;
};
