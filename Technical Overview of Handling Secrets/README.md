# About this lecture

I presented this lecture at the meetup of the DevOps community
on 25. 6. 2025 in Prague.

[Link to event](https://www.meetup.com/prague-devops-meetup/events/307952279/)

## Motivation

Secrets are everywhere. Whenever we want to establish trust between
two systems, secrets will be involved in some form. Almost every application
works with users (and therefore secrets) in some form.

For a developer, it can be confusing to understand all the details
of how to properly handle secrets in their application. But if they don't,
then it has extreme consequences.

## First idea - just hardcode the secrets

- ✅ Simple
- ❌ When deploying, must modify source code and rebuild
- ❌ Bots will scan and reveal your secrets in no-time

## Using .env files (or alike appsettings.json)

- ✅ same binary, just supply a different .env file
- ✅ in git, there can be an "example dev setup"
- ❌ file on disk is unencrypted
- ❌ need to pay attention how to get the file there (FTP - insecure)

Overall, this is a good enough solution for tiny apps (1 developer).
Using environment variables is similarly secure.

But our app keeps growing and we are adding containers (Docker).

## Bake in (runtime) secrets into the container during build time

Options are environment variables or files. Both are bad.

- ❌ anyone with read-access to the image can read the secrets
- ❌ please, don't

Demo:

- `docker build -t secrets-test . --build-arg DB_CONNECTION_STRING="secret connection string set during build"`
- `docker run --entrypoint /bin/sleep secrets-test 100000000`
  - inspect that `env` command will contain the baked in secret

### Side note: Build secrets vs. runtime secrets

The Docker image is built on some machine (be it developer's or
a build server). During `docker build`, we might need access to
some private package repositories, e.g. to perform a `dotnet restore`.

For this, we can utilize a [build-time-only secret](https://docs.docker.com/build/building/secrets/). It is absolutely OK, since it does NOT
get persisted in the final image.
