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
        Console.WriteLine("Connecting to database with hardcoded connection string: " + connectionString);
    }
}