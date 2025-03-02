import { Order } from "../models";

type FuncOrChildren<Value> = Value extends Array<infer Item>
  ? { children: Rule<Item>[] }
  : { func: (param: Value) => Promise<{ error: string } | undefined> };

export type Rule<TObj> = {
  [Key in keyof TObj]?: {
    field: Key;
  } & FuncOrChildren<TObj[Key]>;
}[keyof TObj];

const test: Rule<Order> = {
  field: "id",
  func: async (val) => undefined,
  // @ts-expect-error
  children: [],
};
