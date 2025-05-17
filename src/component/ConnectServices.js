import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";

const tableHead = [
  {
    heading: "Sr No.",
  },
  {
    heading: "Connected Date & Time",
  },
  {
    heading: "Services Name",
  },
  {
    heading: "Exchange Name",
  },
  {
    heading: "Exchange Wallet Balance",
  },
  {
    heading: "Status",
  },
];

const connectedServicesStaticData = [
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "In-Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "In-Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "Banned(09-Apr-2024)",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "In-Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "Active",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "Banned(09-Apr-2024)",
  },
  {
    dateTime: "12-May-2024, 09:30 PM",
    serviceName: "Copy Trading",
    exchangeName: "Binance",
    exchangeWalletBalance: "200 USDT",
    status: "In-Active",
  },
];

export default function ConnectedServices() {
  let filterData;
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "All",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      filterData = {
        page: page,
        limit: 10,
        fromDate:
          checkFilter && selectFilter.fromDate
            ? selectFilter.fromDate.toISOString()
            : undefined,
        toDate:
          checkFilter && selectFilter.toDate
            ? selectFilter.toDate.toISOString()
            : undefined,
        search:
          checkFilter && selectFilter.search !== ""
            ? selectFilter.search
            : undefined,
        status:
          checkFilter && selectFilter.status !== "All"
            ? selectFilter.status
            : undefined,
      };
      const response = await apiRouterCall({
        endPoint: "subAdminList",
        source: source,
        paramsData: filterData,
        token: localStorage.getItem("token"),
      });
      if (response.data.responseCode === 200) {
        setTransactionList(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setTransactionList([]);
      }
      setIsLoading(false);
    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={(param1, param2) => {
            page > 1 && setPage(1);
            page === 1 && handleGetTransaction(param1, param2);
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="SubAdminManagement"
          apiEndPoint="subAdminList"
          placeholder="Search by Email/Name"
        />
      </Box>
      <TableComp
        tableHead={tableHead}
        scoreListData={
          connectedServicesStaticData &&
          connectedServicesStaticData?.map((value, i) => ({
            "Sr No.": (page - 1) * 10 + i + 1,
            "Connected Date & Time": moment(value?.dateTime).format("lll"),
            "Services Name": value?.serviceName,
            "Exchange Name": value?.exchangeName,
            "Exchange Wallet Balance": value?.exchangeWalletBalance,
            Status: (
              <Box
                style={{
                  color:
                    value.status === "Active"
                      ? "#0CA51C"
                      : value.status === "In-Active"
                      ? "yellow"
                      : "#EF2114",
                }}
              >
                {value.status}
              </Box>
            ),
          }))
        }
        noOfPages={noOfPages}
        page={page}
        setPage={setPage}
        NoDataFoundText="default"
        // isLoading={isLoading}
      />
    </Box>
  );
}
