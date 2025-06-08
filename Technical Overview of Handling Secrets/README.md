# About this lecture

I presented this lecture at the meetup of the DevOps community
on 25. 6. 2025 in Prague.

[Link to event](https://www.meetup.com/prague-devops-meetup/events/307952279/)
[Fallback link to event](https://web.archive.org/web/20250608170009/https://www.meetup.com/prague-devops-meetup/events/307952279/)

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

## A bit of theory

If we don't hardcode the secrets in the executable, it has to read the values from **somewhere**.
This "somewhere" is something external to the program.

There are a few options for what exactly that might be:

- Files on the disk
- Environment variables
- Network calls
- ... (other erratic methods like measuring the CPU load, and interpreting the numbers somehow)

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

- `docker build -t secrets-test . --build-arg DB_CONNECTION_STRING="secret"`
- `docker run --cap-drop=all --entrypoint /bin/sleep secrets-test 100000000`
  - inspect that `env` command will contain the baked in secret

### Side note: Build secrets vs. runtime secrets

The Docker image is built on some machine (be it developer's or
a build server). During `docker build`, we might need access to
some private package repositories, e.g. to perform a `dotnet restore`.

For this, we can utilize a [build-time-only secret](https://docs.docker.com/build/building/secrets/). It is absolutely OK, since it does NOT
get persisted in the final image.

## Provide secrets during container start

- ✅ OK solution
- ✅ Good for tiny apps deployed to cloud
- ❌ For big teams, no real benefit in adding containers

Demo:

- `docker build -t secrets-test .`
- `docker run --cap-drop=all secrets-test` shows N/A
- `docker run --cap-drop=all --env DB_CONNECTION_STRING=custom secrets-test` shows `custom`

### Side note: permission to run containers ~ root access

When we allow a user to run Docker containers, they can do e.g.

`docker run --cap-drop=all --mount=type=bind,src="$(pwd)/.env",dst=/tmp/secret --rm busybox cat /tmp/secret`

You can imagine that one can extract e.g. SSH keys.

Our app keeps growing, we have 50 engineers, and kubernetes starts
making sense.

## Use the Secret object in kubernetes

[See docs](https://kubernetes.io/docs/concepts/configuration/secret/) and
[Good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/).

- ✅ Can be good if done correctly
- ❌ Takes some effort to do correctly
  - unencrypted by default
  - anyone can read by default
- ❌ Ability to create a deployment in a NS = Ability to read all NS secrets

Demo:

- `kubectl apply -f .\kube-secret.yml`
- `kubectl describe secret secrets-demo-db` (verifies that the secret is created)
- `docker build -t secrets-test .` (notice we do not pass any connection string, verifiable by `docker run secrets-test`)
- `minikube image load secrets-test` ([preload image](https://minikube.sigs.k8s.io/docs/handbook/pushing/) into k9s)
- `kubectl apply -f .\kube-job.yml` (starts a job, implicitly in some pod with unknown name)
- `kubectl get pods` (find out the pod name)
- `kubectl logs job/secrets-demo-job` (read the logs of the job)

### Side-note: Kubernetes ServiceAccount

- Pods can have their identity "managed" by the kubernetes cluster
- Kubernetes mounts and rotates a JWT token
- The pod can use the token to authenticate against the Kubernetes API Server
- More [docs here](https://kubernetes.io/docs/concepts/security/service-accounts/)

## Using an external Key Vault

[example: Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts).

- ✅ Secret rotation (if supported and configured)
- ✅ Audit log (if supported and configured)
- ❌ Need to authenticate (...with a secret)

Usually, this is what mid-sized serious companies with production-ready products use.

Demo:

- under my personal Microtoft account (robert.gemrot@centrum.cz)
- Created an [app registration in Entra ID](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/quickStartType~/null/sourceType/Microsoft_AAD_IAM/appId/a793e411-ecb3-420a-a91e-5af88bda0c3b/objectId/ae113734-245f-419d-8805-468d3aff9f08/isMSAApp~/false/defaultBlade/Overview/appSignInAudience/AzureADMyOrg/servicePrincipalCreated~/true)
- Assigned a Key Vault Secrets User role to the service principal - [here > Role assignments](https://portal.azure.com/#@robertgemrotcentrum.onmicrosoft.com/resource/subscriptions/8f3fcec5-108b-4c17-bcce-c0a4f79b8944/resourceGroups/devops-demo/providers/Microsoft.KeyVault/vaults/vault-devops-demo/users)
- Created the [secret itself](https://portal.azure.com/#@robertgemrotcentrum.onmicrosoft.com/resource/subscriptions/8f3fcec5-108b-4c17-bcce-c0a4f79b8944/resourceGroups/devops-demo/providers/Microsoft.KeyVault/vaults/vault-devops-demo/secrets)
- in [source code](./SecretsDemo/SecretFromKeyVault.cs), fill in the `client_secret`

## Password-less: Azure managed identity

By hosting an app in the cloud, we can offload managing the identity to the cloud provider.

- ✅ No secrets in _our code_
- ✅ Easy integration with other apps _of the same cloud provider_
- ❌ Not all technology stacks support this

Demo:

- under my school Microtoft account (525262@muni.cz)
- [PA200-HW02 > github-actions](https://portal.azure.com/#@UCNMUNI.onmicrosoft.com/resource/subscriptions/83aa7f25-afa6-4435-a170-acc5294000f4/resourceGroups/PA200-HW02/overview) managed identity
- The managed identity [has some roles](https://portal.azure.com/#@UCNMUNI.onmicrosoft.com/resource/subscriptions/83aa7f25-afa6-4435-a170-acc5294000f4/resourceGroups/PA200-HW02/providers/Microsoft.ManagedIdentity/userAssignedIdentities/github-actions/azure_resources)
- Its [federated credentials](https://portal.azure.com/#@UCNMUNI.onmicrosoft.com/resource/subscriptions/83aa7f25-afa6-4435-a170-acc5294000f4/resourceGroups/PA200-HW02/providers/Microsoft.ManagedIdentity/userAssignedIdentities/github-actions/federatedcredentials) point to a Github repo
- The [CI/CD pipeline](https://github.com/fejbl2/train-me-maybe/blob/pa200/.github/workflows/build-pa200.yaml) uses it
- [More docs](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-identity)

Note that there are always some secrets involved. The "managed identity" only abstracts us away from having to manage them.
