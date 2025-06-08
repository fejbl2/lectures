using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

public static class SecretFromKeyVault
{
    public static void ConnectToDatabase()
    {
        string keyVaultUrl = "https://vault-devops-demo.vault.azure.net/";
        string secretName = "DBConnectionString";

        string tenantId = "0b3e20b1-66a9-4a2e-8a1e-ac184cf6926d";
        string clientId = "a793e411-ecb3-420a-a91e-5af88bda0c3b";
        string clientSecret = "see file .credentials"; // use one of the other described methods to retrieve this secret 

        var credential = new ClientSecretCredential(
            tenantId,
            clientId,
            clientSecret
        );

        var client = new SecretClient(new Uri(keyVaultUrl), credential);

        KeyVaultSecret secret = client.GetSecret(secretName);

        Console.WriteLine($"Successfully retrieved secret {secretName}: {secret.Value}");
    }
}