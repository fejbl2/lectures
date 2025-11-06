import { createContext, useEffect, useState } from "react";
import { msalInstance } from "./msalUtils";

const MsalContext = createContext(null);

let initialized = false; // to ensure msal is initialized only once

export const MsalProvider = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setForceRender] = useState(0);

  useEffect(() => {
    if (!initialized) {
      msalInstance.initialize().then(() => {
        initialized = true;
        setForceRender((prev) => prev + 1); // trigger re-render after initialization
      });
    }
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return <MsalContext.Provider value={null}>{children}</MsalContext.Provider>;
};
