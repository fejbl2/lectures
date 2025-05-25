FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src
COPY SecretsDemo.csproj .
RUN dotnet restore "SecretsDemo.csproj"
COPY . .

# We are building a console application in standalone mode
RUN dotnet publish "SecretsDemo.csproj" -c Release -o /app/publish --self-contained --no-restore

FROM mcr.microsoft.com/dotnet/runtime-deps:9.0 AS final 

# To be safer, we should always run as a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser:appgroup

WORKDIR /app
COPY --chown=appuser:appgroup --from=build /app/publish .

ARG DB_CONNECTION_STRING="N/A"
ENV DB_CONNECTION_STRING=${DB_CONNECTION_STRING}

ENTRYPOINT ["/app/SecretsDemo"]
