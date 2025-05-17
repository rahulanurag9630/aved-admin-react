import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import TransactionHashExplore from "./TransactionHashExplore";
import useDebounce from "./customHook/Debounce";

const tableHead = [
  {
    heading: "Sr No.",
  },
  {
    heading: "Amount",
  },
  {
    heading: "Type",
  },
  {
    heading: "USDT Received/Paid",
  },
  {
    heading: "CWN Price",
  },
  {
    heading: "Date & Time",
  },

  {
    heading: "Txn Hash",
  },
];

export default function FuelWallet({ userData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isClear, setIsClear] = useState(false);
  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "All",
  });
  const deb = useDebounce(selectFilter?.search, 1000);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  let filterData = {
    userId: userData?._id,
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
    transactionSubType:
      selectFilter.status !== "All" ? selectFilter.status : undefined,
    transactionType: "CWN",
  };

  const handleGetTransaction = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "transactionList",
        source: source,
        paramsData: filterData,
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
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Amount: `${value?.amount}`,
        Type: condition ? (
          value.transactionSubType
        ) : (
          <Box
            style={{
              color: value.transactionSubType === "BUY" ? "#0CA51C" : "#EF2114",
            }}
          >
            {value.transactionSubType}
          </Box>
        ),
        "USDT Received/Paid": value?.usdAmount,
        "CWN Price": value?.cwnPrice,
        "Date & Time": moment(value?.createdAt).format("lll"),
        "Txn Hash": condition ? (
          value.transactionHash
        ) : value.transactionHash ? (
          <TransactionHashExplore item={value.transactionHash} />
        ) : (
          "..."
        ),
      }))
    );
  }

  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({
        fromDate: null,
        toDate: null,
        search: "",
        status: "All",
      });
      setPage(1);
      setIsClear(true);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      handleGetTransaction(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (userData?._id) {
      handleGetTransaction(source);
    }
    return () => {
      source.cancel();
    };
  }, [
    page,
    userData?._id,
    deb,
    selectFilter.fromDate,
    selectFilter.toDate,
    selectFilter.status,
  ]);

  return (
    <Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => {
            page > 1 && setPage(1);
            page === 1 && handleGetTransaction();
          }}
          filterData={{
            ...filterData,
            limit: noOfPages.totalPages,
            userId: userData?._id,
          }}
          transactionList={transactionList}
          excelTableName="FuelWalletManagement"
          apiEndPoint="transactionList"
          placeholder="Search by Txn Hash"
          tableDataFunction={tableDataFunction}
          type="fuelwallet"
          handleClearApi={handleClearFilter}
        />
      </Box>
      <TableComp
        tableHead={tableHead}
        scoreListData={tableDataFunction(transactionList)}
        noOfPages={noOfPages}
        page={page}
        setPage={setPage}
        NoDataFoundText="default"
        isLoading={isLoading}
      />
    </Box>
  );
}
