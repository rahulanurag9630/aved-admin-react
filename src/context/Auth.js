import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { apiRouterCall } from "src/ApiConfig/service";
import ERC20ABI from "src/ABI/ERC20ABI.json";

export const AuthContext = createContext();

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("token", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
  }
};

function checkLogin() {
  const accessToken = window.localStorage.getItem("token");
  return accessToken ? true : false;
}

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(checkLogin());
  const [userData, setUserData] = useState({});
  const [connectedExchangeList, setConnectedExchangeList] = useState([]);

  const [userTokenBalance, setUserTokenBalance] = useState({
    totalusdtDividend: 0,
  });

  const getProfileDataHandler = async (token) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "getProfile",
        token: token,
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result);
      } else {
        toast.error("Your session has expired. Please log in again.");
        handleLogout(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getConnectedExchangeList = async () => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listMyExchanges",
      });
      if (response.data.responseCode === 200) {
        setConnectedExchangeList(response.data.result);
      } else {
        setConnectedExchangeList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const handleLogout = (condition) => {
    localStorage.removeItem("token");
    data.userLogIn(false, null);
    condition && window.open("/", "_self");
  };


  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     getProfileDataHandler(localStorage.getItem("token"));
  //     getConnectedExchangeList();
  //   }
  // }, [localStorage.getItem("token")]);

  let data = {
    userLoggedIn: isLogin,
    userData,
    userTokenBalance,
    userLogIn: (type, data) => {
      setSession(data);
      setIsLogin(type);
    },
    connectedExchangeList,
    handleLogout: handleLogout,
    getConnectedExchangeList: () =>
      getConnectedExchangeList(sessionStorage.getItem("token")),
    // getProfileDataHandler: () =>
    //   getProfileDataHandler(localStorage.getItem("token")),
  };

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
}
