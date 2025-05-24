public static class HardcodedSecrets
{
    public static string GetCnnString()
    {
        // Hardcoded secret (not secure)
        return "Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;";
    }

    public static void ConnectToDatabase()
    {
        string connectionString = GetCnnString();
        // Here you would typically use the connection string to connect to a database
        // For example, using ADO.NET or Entity Framework
        // This is just a placeholder for demonstration purposes
        Console.WriteLine("Connecting to database with connection string: " + connectionString);
    }
}