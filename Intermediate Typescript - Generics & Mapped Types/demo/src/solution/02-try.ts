import { Order } from "../models";

export type Rule<TObj> = {
  [Key in keyof TObj]?: {
    field: Key;
    func?: (param: TObj[Key]) => Promise<{ error: string } | undefined>;
    children?: TObj[Key] extends Array<infer Item> ? Rule<Item>[] : never;
  };
};

const test: Rule<Order> = {
  createdAt: {
    field: "createdAt",
    func: async (date) => {
      console.log(date);
      return undefined;
    },
  },
  items: {
    field: "items",
    children: [
      {
        id: {
          field: "id",
          func: async (val) => undefined,
        },
      },
    ],
  },
};
