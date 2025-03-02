interface User {
  name: string;
  age: number;
}

type Age = User["age"]; // indexed access to an object type

interface Apple {
  color: "red" | "yellow" | "green";
}

interface Orange {
  color: "orange";
}

type Fruit = Apple | Orange;

type FruitColor = Fruit["color"];

type Whaaat = User[keyof User];
