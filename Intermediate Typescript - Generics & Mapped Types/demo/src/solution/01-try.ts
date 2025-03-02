export type Rule<TObj> = {
  field: keyof TObj;
  func?: (param: TObj[field]) => Promise<{ error: string } | undefined>;
  children?: Rule<TObj[field]>[];
};
