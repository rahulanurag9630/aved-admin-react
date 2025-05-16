import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles, Grid } from "@material-ui/core";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import { formatNumber } from "src/utils";
import TableComp from "src/component/TableComp";
import MainFilter from "src/component/MainFilter";
import axios from "axios";
import TransactionHashExplore from "src/component/TransactionHashExplore";
import useDebounce from "src/component/customHook/Debounce";
import CommonAddressCom from "src/component/CommonAddressCom";

const useStyles = makeStyles((theme) => ({
  userdashboardBox: {
    "& .countBox1": {
      background: "#fff",
      borderRadius: "10px",
      padding: "30px 0px",
      transition: "0.5s",
      border: "1px solid #80808036",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
  },
}));

export default function FullCWNDeposit({ tabs }) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [isClear, setIsClear] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usermanagementData, setUsermanagementData] = useState([]);
  const [dashboardData, setDashboardData] = useState();
  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
  });
  const deb = useDebounce(selectFilter?.search, 1000);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  let filterData = {
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
    transactionType:
      tabs === "FUEL_WALLET_COPYTRADING"
        ? "FUEL_WALLET_COPYTRADING"
        : tabs === "FuelCWNDeposit" || tabs === "FuelCWNWithdrawal"
        ? "FUEL_WALLET"
        : "CWN",
    transactionSubType:
      tabs === "FUEL_WALLET_COPYTRADING"
        ? undefined
        : tabs === "FuelCWNDeposit"
        ? "CREDIT"
        : tabs === "FuelCWNWithdrawal"
        ? "DEBIT"
        : tabs === "FullCWNDeposit"
        ? "BUY"
        : "SELL",
  };

  const isDepositTab = ["FullCWNDeposit", "FuelCWNDeposit"].includes(tabs);
  const getKey = (key) => (isDepositTab ? key : `${key}Sell`);
  const periods = ["today", "sevenDays", "monthly", "total"];

  const activatedarrayData = periods.map((period, i) => ({
    title: `${["Todays", "7 Days", "30 Days", "Total"][i]} ${
      isDepositTab ? "Deposit" : "Withdraw"
    }`,
    count: dashboardData?.[getKey(period)],
  }));

  const tableHead = [
    {
      heading: "Sr No.",
      column: 0,
      isMobile: true,
    },

    {
      heading: "First Name",
      column: 0,
      isMobile: true,
    },
    {
      heading: "Last Name",
      column: 0,
      isMobile: true,
    },
    {
      heading: "Email",
      column: 0,
      isMobile: true,
      isCopy: true,
    },
    ...(tabs !== "FUEL_WALLET_COPYTRADING"
      ? [
        {
          heading: "Wallet Address",
          column: 1,
          isMobile: true,
        },
        ]
      : []),
  
    ...(tabs === "FUEL_WALLET_COPYTRADING"
      ? [
          {
            heading: "Transaction Type",
            column: 2,
            isMobile: true,
          },
        ]
      : []),
    ...(tabs === "FUEL_WALLET_COPYTRADING" || tabs === "FuelCWNWithdrawal"
      ? [
          {
            heading: "Symbol",
            column: 2,
            isMobile: true,
          },
        ]
      : []),
    {
      heading: "Date & Time",
      column: 1,
      isMobile: true,
    },
    {
      heading: "Amount",
      column: 2,
      isMobile: true,
    },
    ...(tabs !== "FuelCWNDeposit" &&
    tabs !== "FuelCWNWithdrawal" &&
    tabs !== "FUEL_WALLET_COPYTRADING"
      ? [
          {
            heading: "USDT Amount",
            column: 2,
            isMobile: true,
          },
        ]
      : []),
    {
      heading: "Txn Hash",
      column: 2,
      isMobile: true,
    },
  ];

  const getUserManagementApi = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "transactionList",
        source: source,
        paramsData: filterData,
        token: localStorage.getItem("token"),
      });
      if (response.data.responseCode === 200) {
        setUsermanagementData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setUsermanagementData([]);
      }
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setUsermanagementData([]);
      setIsLoading(false);
      console.log(err);
    }
  };
  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({
        fromDate: null,
        toDate: null,
        search: "",
      });
      setPage(1);
      setIsClear(true);
    }
  };

  const getDashboardData = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: tabs === "FuelCWNDeposit" ? "userDepositData" : "userBuyData",
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setDashboardData(response.data.result);
      } else {
        setDashboardData();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        "First Name": value?.firstName,
        "Last Name": value?.lastName,
        Email: value?.email,
        "Wallet Address": condition ? (
          value.walletAddress
        ) : value.walletAddress ? (
          <CommonAddressCom text={value.walletAddress} />
        ) : (
          "..."
        ),
        "Transaction Type":value?.transactionSubType,
        "Symbol":value?.coinName,
        "Date & Time": moment(value?.createdAt).format("lll"),
        Amount: formatNumber(value?.amount || 0, 5),
        "USDT Amount": formatNumber(value?.usdAmount || 0, 5),
        "Txn Hash":
          tabs !== "FuelCWNDeposit" ? (
            <CommonAddressCom text={value.orderId} />
          ) : condition ? (
            value.walletAddress
          ) : value.transactionHash ? (
            <TransactionHashExplore item={value.transactionHash} />
          ) : (
            "..."
          ),
      }))
    );
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDashboardData(source);
    return () => {
      source.cancel();
    };
  }, [tabs === "FuelCWNDeposit"]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      getUserManagementApi(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getUserManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page, tabs, deb, selectFilter.fromDate, selectFilter.toDate]);

  return (
    <>
      <Box className={classes.userdashboardBox}>
        {tabs == "FuelCWNDeposit" && (
          <Box mt={1.5} mb={4}>
            <Grid container spacing={2}>
              {activatedarrayData?.map((value) => (
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="countBox1" align="center">
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      className="trimText"
                    >
                      {value?.title}
                    </Typography>
                    <Box mt={1}>
                      <Typography
                        variant="body2"
                        color="secondary"
                        className="countBox2"
                      >
                        {value?.count || "0"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => {
            page > 1 && setPage(1);
            page === 1 && getUserManagementApi();
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={usermanagementData}
          excelTableName="CWNDeposit"
          apiEndPoint="getUserList"
          type="eventMgmt"
          placeholder="Search by Name/Email/Txn Hash"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />

        <TableComp
          isMobileAdaptive={true}
          tableHead={tableHead}
          scoreListData={tableDataFunction(usermanagementData)}
          noOfPages={noOfPages}
          page={page}
          setPage={setPage}
          NoDataFoundText="default"
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}
