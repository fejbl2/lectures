// @ts-nocheck
export const validateObject = async (obj, rules) => {
  const errors = {};
  for (const rule of rules) {
    if ("children" in rule && rule.children) {
      const childErrors = {};

      if (Array.isArray(obj[rule.field])) {
        for (const item of obj[rule.field]) {
          const childError = await validateObject(item, rule.children);
          if (Object.keys(childError).length > 0) {
            childErrors[item[rule.childrenKey]] = childError;
          }
        }
      }

      if (Object.keys(childErrors).length > 0) {
        errors[rule.field] = childErrors;
      }
    } else if ("func" in rule) {
      const val = obj[rule.field];

      // If validation function is defined, use it
      const result = await rule.func(val, obj);

      if ("error" in result && result.error) {
        errors[rule.field] = result;
      }
    }
  }
  return errors;
};
