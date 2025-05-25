public static class SecretFromDocker
{
    public static void ConnectToDatabase()
    {
        // Retrieve the connection string from environment variables set by Docker
        string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "N/A";

        Console.WriteLine("Connecting to database with connection string from Docker: " + connectionString);
    }
}