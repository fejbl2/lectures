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
