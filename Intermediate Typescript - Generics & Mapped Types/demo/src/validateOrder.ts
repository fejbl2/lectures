import { Order } from "./models";
import { validateObject } from "./validator";

export const validateOrder = async (order: Order) => {
  const rules = [
    {
      field: "createdAt",
      func: async (val) => {
        if (!(val instanceof Date)) {
          return { error: "createdAt must be a Date" };
        }
      },
    },
    {
      field: "items",
      children: [
        {
          field: "quantity",
          func: async (val) => {
            if (typeof val !== "number") {
              return { error: "quantity must be a number" };
            }

            if (val <= 0) {
              return { error: "quantity must be greater than 0" };
            }
          },
        },
        {
          field: "reservations",
          children: [
            {
              field: "reservedModelId",
              func: async (modelId) => {
                if (!modelId || modelId.length <= 0) {
                  return { error: "Model Id must be defined!" };
                }
              },
            },
          ],
        },
      ],
    },
  ];

  const result = await validateObject(order, rules);
  return result;
};
