import { Contract } from "@ethersproject/contracts";
import { NetworkDetails } from "src/constants";
import moment from "moment";
import { apiRouterCall } from "src/ApiConfig/service";
import * as XLSX from "xlsx";
import CryptoJS from "crypto-js";

const secret = process.env.REACT_APP_SECRET_KEY || "000x";

export function sortAddress(add) {
  const sortAdd = `${add?.slice(0, 6)}...${add?.slice(add?.length - 4)}`;
  return sortAdd;
}
export function calculatePercentage(part, whole) {
  return (part / whole) * 100;
}
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

export function getContract(address, ABI, library, account) {
  return new Contract(address, ABI, getProviderOrSigner(library, account));
}



export const swichNetworkHandler = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: "0x" + process.env.REACT_APP_ACTIVE_CHAIN.toString(16) },
      ],
    });
  } catch (error) {
    if (error.code === 4902) {
      addNetworkHandler();
    }
  }
};
const addNetworkHandler = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: NetworkDetails,
    });
  } catch (error) {
    console.log("ERROR", error);
  }
};
export const MenuProps = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
};
export const getNumberInputProps = () => ({
  onKeyPress: (event) => {
    if (event.key === "-" || event.key === "+") {
      event.preventDefault();
    }
  },
  onKeyDown: (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
    }
  },
  InputProps: {
    inputProps: {
      step: 1,
      min: 0,
    },
    endAdornment: null,
  },
});

// export function capitalizeFirstLetter(string) {
//   return string[0].toUpperCase() + string?.slice(1);
// }
export function ReplaceDash(value, w) {
  return value.replace(/-/g, w);
}

export const setCryptoDecimals = (amt) => {
  amt = exponentialToDecimal(amt || 0);

  amt = amt?.replace(",", "");
  let arr = amt?.toString().split(".");

  if (arr.length > 1) {
    if (arr[1].length > 4) {
      return numberWithCommas(
        exponentialToDecimal(parseFloat(amt).toFixed(4)).toString()
      ).toString();
    } else {
      return numberWithCommas(parseFloat(amt).toFixed(4)).toString();
    }
  } else {
    if (amt) {
      return numberWithCommas(parseFloat(amt).toFixed(2)).toString();
    }
    return "0";
  }
};

export const exponentialToDecimal = (exponential) => {
  let decimal = exponential?.toString()?.toLowerCase();
  if (decimal?.includes("e+")) {
    const exponentialSplitted = decimal?.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text?.slice(0, textLength - j)},${text?.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
  if (decimal?.toLowerCase().includes("e-")) {
    const exponentialSplitted = decimal?.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
};

const numberWithCommas = (x) => {
  let str = toFixedFunction(x, 8);

  let arr = str.split(".");

  let numbers = arr[0];
  let decimalNum = "";
  if (arr.length > 1) {
    decimalNum = arr[1];
    return `${numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalNum}`;
  } else {
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
export function fixDecimal(number) {
  const zeroCount = countZerosAfterDecimal(number);

  if (zeroCount === 0 && number === Math.floor(number)) {
    return number.toString();
  } else if (zeroCount === 0 || number >= 1) {
    return parseFloat(number).toFixed(4);
  } else if (number < 1) {
    return parseFloat(number)
      .toFixed(zeroCount + 4)
      .toString();
  }
}

export const toFixedFunction = (amt, decimals) => {
  let str = amt?.toString();
  if (str?.includes(".")) {
    str = str?.slice(0, str.indexOf(".") + (decimals + 1));
  }
  return str;
};
export function countZerosAfterDecimal(number) {
  const numString = number.toString();
  const decimalIndex = numString.indexOf(".");
  if (decimalIndex === -1) {
    return 0;
  }

  let zeroCount = 0;
  for (let i = decimalIndex + 1; i < numString.length; i++) {
    if (numString[i] === "0") {
      zeroCount++;
    } else {
      break;
    }
  }
  return zeroCount;
}

export const calculateTimeLeftForOtp = (endDate) => {
  if (endDate) {
    let difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  } else {
    return false;
  }
};

export const calculateTimeLeft = (endDate) => {
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const difference = +new Date(endDate) - +new Date();
  if (difference <= 0) return "live";
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(
      2,
      "0"
    ),
    minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
  };
};

export const calculateTimeLeftForRace = (endDate) => {
  if (endDate) {
    // let difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (endDate > 0) {
      timeLeft = {
        days: Math.floor(endDate / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDate / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDate / 1000 / 60) % 60),
        seconds: Math.floor((endDate / 1000) % 60),
      };
    }
    return timeLeft;
  } else {
    return false;
  }
};

export function convertToMinutesAndSeconds(seconds) {
  return `${Math.floor(seconds / 60)}m :${Math.floor(seconds % 60)}s`;
}

export function convertUnityToMinutesAndSeconds(seconds) {
  return `${Math.floor(seconds / 60)}m:${Math.floor(seconds % 60)}s`;
}

export const findEventStatus = (startDate, endDate) => {
  if (startDate && endDate) {
    if (moment(endDate).unix() < moment().unix()) {
      return "Ended";
    } else if (
      moment().unix() < moment(endDate).unix() &&
      moment().unix() > moment(startDate).unix()
    ) {
      return "Live";
    } else {
      return "Upcoming";
    }
  }
};

export function numberCompactFormat(value) {
  if (value < 1) {
    return value.toFixed(4);
  }
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export const paramsVal = {
  secure: true,
  reconnect: true,
  rejectUnauthorized: false,
  transports: ["websocket", "polling", "flashsocket"],
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const formatNumber = (num, lenVal) =>
  Number.isInteger(num)
    ? num.toLocaleString()
    : +parseFloat(num).toFixed(lenVal).toLocaleString();

export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (err) {
    console.log("Error: ", err);
  };
};

export const downloadExcel = (dataToPrint, sheetName) => {
  const now = new Date();
  const currentTime = `${now.toLocaleDateString(
    "en-GB"
  )} ${now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  const cleanedData = dataToPrint.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        typeof value === "string" && value.length > 32767
          ? value.substring(0, 32767)
          : value,
      ])
    )
  );

  if (cleanedData.length === 0) return console.error("No data to export.");

  const workBook = XLSX.utils.book_new();
  const workSheet = XLSX.utils.json_to_sheet(cleanedData);
  const formattedSheetName = `${sheetName}${currentTime}`
    .slice(0, 31)
    .replace(/[\/:*?"<>|]/g, "_");

  XLSX.utils.book_append_sheet(workBook, workSheet, formattedSheetName);
  XLSX.writeFile(workBook, `${formattedSheetName}.xlsx`);
};

export const listUserHandlerExcel = async ({ paramsData, endPoint }) => {
  try {
    const res = await apiRouterCall({
      endPoint: endPoint,
      paramsData: {
        ...paramsData,
        page: 1,
      },
    });
    if (res.data.responseCode === 200) {
      return res.data.result.docs;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const isValidIPv6 = (ip) => {
  const ipv6Pattern =
    /^(?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){1,6}|:(:[0-9a-fA-F]{1,4}){1,7}|::(?:[0-9a-fA-F]{1,4}){1,7}$/;
  return ipv6Pattern.test(ip);
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

let sortOrder = "asc";
export const sortArrayData = (initialValue, key) => {
  const sortedArray = [...initialValue].sort((a, b) => {
    const valueA = isNaN(a[key])
      ? String(a[key]).charAt(0).toUpperCase()
      : parseFloat(a[key]);
    const valueB = isNaN(b[key])
      ? String(b[key]).charAt(0).toUpperCase()
      : parseFloat(b[key]);
    const compareResult =
      typeof valueA === "string"
        ? valueA.localeCompare(valueB)
        : valueA - valueB;
    return sortOrder === "asc" ? compareResult : -compareResult;
  });
  sortOrder = sortOrder === "asc" ? "desc" : "asc";
  return sortedArray;
};

export function toSpaceSeparated(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export const clearFieldsBasedOnSelection = (values) => {
  const { allAssets, ...rest } = values;
  return {
    ...rest,
    allAssets: allAssets,
    nitro: allAssets === "nitro" ? rest.nitro : undefined,
    speed: allAssets === "speed" ? rest.speed : "",
    motorTorque: allAssets === "motorTorque" ? rest.motorTorque : "",
    brakeTorque: allAssets === "brakeTorque" ? rest.brakeTorque : "",
    mass: allAssets === "mass" ? rest.mass : "",
  };
};

export const routeGroups = {
  UserRoutes: ["/usermanagement", "/user-profile"],
  SubAdminRoutes: [
    "/sub-admin-management",
    "/add-sub-admin",
    "/view-sub-admin",
  ],
  SubAdminActivityRoutes: ["/subadmin-activity"],
  FundManagementRoutes: ["/reward-management"],
  // WhiteListRoutes: ["/whitelist-management"],
  StaticRoutes: ["/static", "/static-content"],
  FaqStaticRoutes: ["/faq", "/static-content"],
  walletManagement: ["/wallet-management"],
  fuelManagement: ["/fuel-management"],
  tradeManagement: ["/trade-management"],
  apiManagement: ["/api-management"],
  exchangeManagement: ["/list-exchanges", "/exchanges"],
  TicketRoutes: ["/ticket-management", "/pending-ticket"],
};

export const getUpdatedRoutes = (matchedArray, routeGroups) => {
  const existingRoutes = new Set(matchedArray);
  for (const routes of Object.values(routeGroups)) {
    const isGroupMatched = routes.some((route) => matchedArray.includes(route));
    if (isGroupMatched) {
      routes.forEach((route) => {
        existingRoutes.add(route);
      });
    }
  }
  return Array.from(existingRoutes);
};

export const showAssetValue = (data) => {
  return data?.motorTorque || data?.mass || data?.topSpeed || data?.brakeTorque;
};

export const encrypt = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secret);
  return encryptedData.toString();
};

export const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error("Decryption or JSON parsing failed:", error);
    return null; // Return null on failure
  }
};

export const validateAccountAddress = (address) => {
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
};

export const ExchangeArray = [
  { img: "/images/ExchangeLogo/kraken.png", coinName: "Kraken" },
  { img: "/images/binance.svg", coinName: "Binance" },
  { img: "/images/ExchangeLogo/Mexc.png", coinName: "Mexc" },
  { img: "/images/ExchangeLogo/Bitmart.jpg", coinName: "Bitmart" },
  { img: "/images/ExchangeLogo/gemini.png", coinName: "Gemini" },
  { img: "/images/ExchangeLogo/coinbasepro.png", coinName: "Coinbasepro" },
  { img: "/images/ExchangeLogo/bitstamp.png", coinName: "bitstamp" },
  { img: "/images/ExchangeLogo/coinbase.png", coinName: "coinbase" },
  { img: "/images/ExchangeLogo/gateio.png", coinName: "gateio" },
];

export const ExchangeLogo = [
  {
    img: "/images/ExchangeLogo/gateio.png",
    title: "gateio",
  },
  {
    img: "/images/ExchangeLogo/coinbase.png",
    title: "coinbase",
  },
  {
    img: "/images/binance.svg",
    title: "binance",
  },
  {
    img: "/images/ExchangeLogo/bitstamp.png",
    title: "bitstamp",
  },
  {
    img: "/images/ExchangeLogo/Mexc.png",
    title: "Mexc",
  },
  {
    img: "/images/ExchangeLogo/Bitmart.jpg",
    title: "Bitmart",
  },
  {
    img: "/images/ExchangeLogo/cryptocom.png",
    title: "cryptocom",
  },
  {
    img: "/images/ExchangeLogo/ftxus.png",
    title: "ftxus",
  },
  {
    img: "/images/ExchangeLogo/gemini.png",
    title: "gemini",
  },
  {
    img: "/images/ExchangeLogo/cexio.png",
    title: "cexio",
  },
  {
    img: "/images/ExchangeLogo/huobi.png",
    title: "huobi",
  },
  {
    img: "/images/ExchangeLogo/kraken.png",
    title: "kraken",
  },
  {
    img: "/images/ExchangeLogo/kucoin.png",
    title: "kucoin",
  },
];

export function funConEx(exchanges) {
  const filteredExchanges = [];
  for (const exchange of exchanges) {
    const matchingExchange = ExchangeArray.find(
      (exchangeOption) =>
        exchange.exchangeName.toLowerCase() ===
        exchangeOption.coinName.toLowerCase()
    );
    filteredExchanges.push({
      ...exchange,
      img: matchingExchange
        ? matchingExchange.img
        : exchange.exchangeName.toLowerCase(), // Fallback if no match is found
    });
  }
  return filteredExchanges;
}
