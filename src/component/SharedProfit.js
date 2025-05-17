import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import axios from "axios";
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
    heading: "Connected Services",
  },
  {
    heading: "Date & Time",
  },
  {
    heading: "Type",
  },
  {
    heading: "Closing Balance",
  },

  {
    heading: "Txn Hash",
  },
];

export default function SharedProfit({ userData }) {
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
    transactionType: "FUEL_WALLET",
  };

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
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
        Amount: value?.amount,
        "Connected Services": value?.connectedServices,
        "Date & Time": moment(value?.createdAt).format("lll"),
        Type: value?.transactionSubType,
        "Closing Balance": value?.usdAmount,
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
          excelTableName="SharedProfitManagement"
          apiEndPoint="transactionList"
          placeholder="Search by Txn Hash"
          tableDataFunction={tableDataFunction}
          type="sharedprofit"
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
