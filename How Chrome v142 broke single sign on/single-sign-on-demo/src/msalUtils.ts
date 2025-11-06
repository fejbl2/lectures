import {
  PublicClientApplication,
  type AuthenticationResult,
  type Configuration,
} from "@azure/msal-browser";

const TENANT_ID = "0b3e20b1-66a9-4a2e-8a1e-ac184cf6926d"; // my private tenant - https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview
const CLIENT_ID = "814ba715-6611-4ab3-ae98-986378c48ef8"; // Demo app client ID (ssoSilent demo) - https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/814ba715-6611-4ab3-ae98-986378c48ef8/isMSAApp~/false

const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: location.origin + "/login-landing.html",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    // iframeHashTimeout: 2000,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const trySilentLogin = async (): Promise<
  Error | AuthenticationResult
> => {
  let response: Error | AuthenticationResult;

  try {
    response = await msalInstance.ssoSilent({
      scopes: ["User.Read"],
    });

    console.info("ssoSilent response:", response);
  } catch (error) {
    response = error as Error;
    console.error("ssoSilent error:", error);
  }

  return response;
};

export const tryInteractiveLogin = async (): Promise<
  Error | AuthenticationResult
> => {
  let response;

  try {
    response = await msalInstance.loginPopup({
      scopes: ["User.Read"],
    });
    console.info("Interactive login response:", response);
  } catch (error) {
    response = error as Error;
    console.error("Interactive login error:", error);
  }
  return response;
};
