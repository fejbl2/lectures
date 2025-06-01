public static class SecretFromEnvVar
{
    public static void ConnectToDatabase()
    {
        string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "N/A";

        Console.WriteLine("Connecting to database with connection string from Environment variable: " + connectionString);
    }
}