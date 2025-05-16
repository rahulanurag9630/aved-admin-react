import React, { createContext, useEffect } from "react";
import { injected } from "src/connectors";

export const UserContext = createContext();

const setSession = (userAddress) => {
  if (userAddress) {
    sessionStorage.setItem("userAddress", userAddress);
  } else {
    sessionStorage.removeItem("userAddress");
  }
};

export default function AuthProvider(props) {

  let data = {
    updateUser: (account) => {
      setSession(account);
    },
  
  };

  // useEffect(() => {
  //   const userAddress = window.sessionStorage.getItem("userAddress");
  //   if (userAddress) {
  //     data.connectWallet();
  //   }
  // }, []); //eslint-disable-line

  // useEffect(() => {
  //   data.updateUser(account);
  // }, [account]); //eslint-disable-line

  return (
    <UserContext.Provider value={data}>{props.children}</UserContext.Provider>
  );
}
