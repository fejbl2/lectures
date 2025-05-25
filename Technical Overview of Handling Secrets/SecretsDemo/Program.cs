using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

IConfigurationRoot config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

HardcodedSecrets.ConnectToDatabase();

Console.WriteLine("----------------------------------------");

SecretsFromAppsettings.ConnectToDatabase(config);

Console.WriteLine("----------------------------------------");

SecretFromDocker.ConnectToDatabase();

Console.WriteLine("----------------------------------------");