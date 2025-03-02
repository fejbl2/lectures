interface User {
  name: string;
  age: number;
}

interface Apple {
  color: "red" | "yellow" | "green";
  size: "S" | "M" | "L";
}

// generic "saves" the passed runtime `value`, and therefore we can "connect" multiple arguments together
const doAction = <T>(value: T, callback: (arg: T) => void) => {
  callback(value);
};

const user: User = {
  name: "Robert Gemrot",
  age: 2,
};

const apple: Apple = {
  color: "green",
  size: "M",
};

doAction(user, (u) => (u.name = "..."));
doAction(apple, (a) => (a.color = "yellow"));
