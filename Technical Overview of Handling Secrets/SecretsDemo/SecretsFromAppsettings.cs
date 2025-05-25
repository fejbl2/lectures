using Microsoft.Extensions.Configuration;

public class SecretsFromAppsettings
{
    public static void ConnectToDatabase(IConfigurationRoot config)
    {
        // Retrieve the connection string from appsettings.json
        string connectionString = config.GetConnectionString("DefaultConnection") ?? "N/A";

        Console.WriteLine("Connecting to database with connection string from config: " + connectionString);
    }
}