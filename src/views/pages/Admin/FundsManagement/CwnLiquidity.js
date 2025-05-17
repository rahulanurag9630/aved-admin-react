import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import axios from "axios";
import TransactionHashExplore from "src/component/TransactionHashExplore";
import useDebounce from "src/component/customHook/Debounce";

const tableHead = [
  {
    heading: "Sr No.",
    column: 0,
    isMobile: true,
  },

  {
    heading: "Amount",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Pool Name",
    column: 2,
    isMobile: true,
  },
  {
    heading: "Type",
    column: 0,
    isMobile: true,
  },
  {
    heading: "User By",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Txn Hash",
    column: 2,
    isMobile: true,
    // isCopy: true,
  },
  {
    heading: "Date & Time",
    column: 2,
    isMobile: true,
  },
];

export default function CwnLiquidity() {
  const [isLoading, setIsLoading] = useState(false);
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
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
    transactionSubType:
      selectFilter.status !== "All" ? selectFilter.status : undefined,
    transactionType: "DISTRIBUTION",
  };

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      setIsLoading(true);
      setTransactionList([]);

      const response = await apiRouterCall({
        endPoint: "transactionList",
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
        Amount: `${value?.amount} USDT`,
        "Pool Name": value?.transactionSubType,
        Type: value?.walletAddress ? "User" : "Pool Credit",
        "User By": value?.userByEmail
          ? value?.userByEmail
          : "Pool Distribution",
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
    handleGetTransaction(source);
    return () => {
      source.cancel();
    };
  }, [
    page,
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
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="Management"
          apiEndPoint="transactionList"
          placeholder="Search by Email"
          tableDataFunction={tableDataFunction}
          type="rewardDistri"
          handleClearApi={handleClearFilter}
        />
      </Box>
      <TableComp
        isMobileAdaptive={true}
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
