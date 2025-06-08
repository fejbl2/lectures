using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

IConfigurationRoot config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

Console.WriteLine("----------------------------------------");

HardcodedSecrets.ConnectToDatabase();

Console.WriteLine("----------------------------------------");

SecretsFromAppsettings.ConnectToDatabase(config);

Console.WriteLine("----------------------------------------");

SecretFromEnvVar.ConnectToDatabase();

Console.WriteLine("----------------------------------------");

SecretFromMount.PrintSecrets();

Console.WriteLine("----------------------------------------");

SecretFromKeyVault.ConnectToDatabase();

Console.WriteLine("----------------------------------------");


// Wait for a lot of time (100min) before exiting for demo purposes
Thread.Sleep(100 * 60 * 1000);
