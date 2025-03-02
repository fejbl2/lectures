# About this lecture

I presented this lecture at the meetup of the Frontendisti community
on 12. 3. 2025 in Brno.

[Link to event](https://www.meetup.com/frontendisti/events/306253481/)

## Motivation

You have existing custom validation code, with no type annotations,
living in file [validator.ts](./demo/src/validator.ts).

The validator takes an object and a set of rules, and performs
validation of the object according to the rules.

Example of the rules is in [validateOrder.ts](./demo/src/validateOrder.ts).
We can see that the object type and the rules are connected, but this
is currently not enforced in any way. Also, IntelliSense is not working.

We want to add a type annotation to the `const rules = [`, so that
we get errors if we make a typo-like mistake.

## Introducing generics

Because the rules depend on the type of object we are validating,
the type of a single rule will depend on the type of object as well.
This relationship can be expressed by using generics.

See [explainer](./demo/src/explainers/generics.ts).

## First try - generic only

The rules always have a `field`, and then also `func` or `children`.

The `field` needs to reference an existing property of the object to validate,
therefore we use `keyof TObj`.

Now the `func` callback should take a single argument with the type corresponding
to entered `field`. But if we try to use this `TObj[field]`, we get wrong syntax.

The same applies for `children` - we get syntax errors.

See the [first try](./demo/src/solution/01-try.ts).

## Introducing mapped types

In a moment we will use a clever trick, relying on behaviour of mapped types.
They allow us to loop over all keys of an object in the type world.

See [explainer](./demo/src/explainers/mapped-types.ts).

## Second try - with mapped types

If we look at [second try](./demo/src/solution/02-try.ts), we are using
mapped types to "connect" information about the current `Key` (and therefore
field), with the expected types of the `func` and `children`.

But! The expected API changed and no longer matches the validation function.
We need to fix this.

## Introducing index access types

Index accessed types allow us to create unions of types from object properties.

See [explainer](./demo/src/explainers/index-accessed-types.ts).

## Third try - it works!

Have a look at the [solution](./demo/src/solution/03-try.ts). From the second
try, it only differs by indexing into the created `Rule` type using `[keyof TObj]`.
This uses index accessed types in the same way that `User[keyof User];` worked.

Now play around with [`validateOrder`](./demo/src/validateOrder.ts). The Intellisense
should be fully functional.

## Better TS validation

Currently, `func` and `children` are both optional. This means it is possible to create
an empty rule!

```ts
const test3: Rule<Order> = {
  field: "items",
};
```

We do not like this and want TS to inform us.

The [fourth try](./demo/src/solution/04-try.ts) solves this.
