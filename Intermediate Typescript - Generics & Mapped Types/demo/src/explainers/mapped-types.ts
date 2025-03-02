interface User {
  name: string;
  age: number;
}

type MakeOptional<TObj> = {
  [Key in keyof TObj]?: TObj[Key];
};

type OptionalUser = MakeOptional<User>;
