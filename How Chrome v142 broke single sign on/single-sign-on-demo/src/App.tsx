import type { AuthenticationResult } from "@azure/msal-browser";
import { useState } from "react";
import "./App.css";
import { MsalProvider } from "./msalProvider";
import { tryInteractiveLogin, trySilentLogin } from "./msalUtils";

type Phase =
  | null
  | "ssoSilentInProgress"
  | "ssoSilentFailed"
  | "interactiveLoginInProgress"
  | "interactiveLoginSuccess";

const getText = (phase: Phase) => {
  switch (phase) {
    case "ssoSilentInProgress":
      return "Attempting silent login...";
    case "ssoSilentFailed":
      return "Silent login failed. Click here to try interactive login.";
    case "interactiveLoginInProgress":
      return "Attempting interactive login...";
    case "interactiveLoginSuccess":
      return "Interactive login successful!";
    case null:
      return "Click the button to log in";
  }
};

function App() {
  const [response, setResponse] = useState<Error | AuthenticationResult | "">(
    ""
  );
  const [phase, setPhase] = useState<Phase>(null);

  const handleTrySilentLogin = async () => {
    setPhase("ssoSilentInProgress");

    const authResponse = await trySilentLogin();
    setResponse(authResponse);

    if (authResponse && "errorCode" in authResponse) {
      setPhase("ssoSilentFailed");
    } else {
      setPhase(null);
    }
  };

  const handleTryInteractiveLogin = async () => {
    setPhase("interactiveLoginInProgress");

    const authResponse = await tryInteractiveLogin();
    setResponse(authResponse);

    if (authResponse && "errorCode" in authResponse) {
      setPhase(null);
    } else {
      setPhase("interactiveLoginSuccess");
    }
  };

  const getHandler = () => {
    if (phase === null) {
      return handleTrySilentLogin;
    }

    if (phase === "ssoSilentFailed") {
      return handleTryInteractiveLogin;
    }

    return undefined;
  };

  return (
    <MsalProvider>
      <h1>Single sign on demo</h1>
      <div className="card">
        <button
          onClick={getHandler()}
          disabled={
            phase === "ssoSilentInProgress" ||
            phase === "interactiveLoginInProgress"
          }
        >
          {getText(phase)}
        </button>
      </div>
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </MsalProvider>
  );
}

export default App;
