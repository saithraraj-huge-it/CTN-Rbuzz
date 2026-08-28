import React, { createContext, useContext, useState, useEffect } from "react";
import { setServerStatusRef } from "../utils/serverStatusRef";

const ServerStatusContext = createContext(null);

export const ServerStatusProvider = ({ children }) => {
  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    setServerStatusRef({
      setServerDown: setIsServerDown,
    });
  }, []);

  return (
    <ServerStatusContext.Provider
      value={{
        isServerDown,
        setServerDown: setIsServerDown,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error(
      "useServerStatus must be used inside ServerStatusProvider"
    );
  }
  return context;
};
