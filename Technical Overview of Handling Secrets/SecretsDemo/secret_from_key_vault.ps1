# Get OAuth2 token from Entra ID
$tenantId = "0b3e20b1-66a9-4a2e-8a1e-ac184cf6926d"
$clientId = "a793e411-ecb3-420a-a91e-5af88bda0c3b"
$clientSecret = "Scw4QUc-e"

$tokenUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
$tokenBody = @{
    grant_type    = "client_credentials"
    client_id     = $clientId
    client_secret = $clientSecret
    scope         = "https://vault.azure.net/.default"
}

$tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method POST -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
$accessToken = $tokenResponse.access_token

Write-Host "Successfully obtained access token"

# Get secret from Key Vault
$keyVaultUrl = "https://vault-devops-demo.vault.azure.net"
$secretName = "DBConnectionString"
$secretUrl = "$keyVaultUrl/secrets/$secretName" + "?api-version=7.4"

$headers = @{
    Authorization = "Bearer $accessToken"
}

try {
    $secretResponse = Invoke-RestMethod -Uri $secretUrl -Method GET -Headers $headers
    Write-Host "Successfully retrieved secret $secretName`: $($secretResponse.value)"
}
catch {
    Write-Error "Failed to retrieve secret: $($_.Exception.Message)"
}