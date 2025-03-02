import { Order } from "../models";

export type Rule<TObj> = {
  [Key in keyof TObj]?: {
    field: Key;
    func?: (param: TObj[Key]) => Promise<{ error: string } | undefined>;
    children?: TObj[Key] extends Array<infer Item> ? Rule<Item>[] : never;
  };
}[keyof TObj];

const test: Rule<Order> = {
  field: "createdAt",
  func: async (val) => undefined,
};

const test2: Rule<Order> = {
  field: "items",
  children: [
    {
      field: "productId",
      func: async (val) => undefined,
    },
  ],
};

// We would like this to be forbidden - no validation or children are specified
const test3: Rule<Order> = {
  field: "items",
};
