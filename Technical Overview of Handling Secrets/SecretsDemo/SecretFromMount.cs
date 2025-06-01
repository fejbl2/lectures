public static class SecretFromMount
{
    public static void PrintSecrets()
    {
        // Assuming the secret file is mounted at relative path "secrets/DB_CONNECTION_STRING"
        try
        {
            string secrets = File.ReadAllText("secrets/DB_CONNECTION_STRING").Trim();

            Console.WriteLine("Read secrets from a file:" + secrets);
        }
        catch
        {
            Console.WriteLine("No mounted file to read secrets from.");
        }
    }
}