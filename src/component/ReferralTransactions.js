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
    heading: "Transaction Hash",
  },

  {
    heading: "Email Id",
  },
  {
    heading: "First Name",
  },
  {
    heading: "Last Name",
  },
  {
    heading: "Txn Amount",
  },
  {
    heading: "Designations",
  },
  {
    heading: "Levels",
  },
  {
    heading: "Date & Time",
  },
  {
    heading: "Claimed Date & Time",
  },
];

export default function ReferralTransactions({ userData }) {
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
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
    transactionType: "REFERRAL",
  };

  const handleGetTransaction = async (source) => {
    try {
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
        "Transaction Hash": condition ? (
          value.transactionHash
        ) : value.transactionHash ? (
          <TransactionHashExplore item={value.transactionHash} />
        ) : (
          "..."
        ),
        "Email Id": value?.email,
        "First Name": value?.firstName,
        "Last Name": value?.lastName,
        "Txn Amount": value?.usdAmount,
        Designations: value?.designation,
        Levels: value?.level,
        "Date & Time": moment(value?.createdAt).format("lll"),
        "Claimed Date & Time": value?.claimedDate
          ? moment(value?.claimedDate).format("lll")
          : "...",
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
          excelTableName="SubAdminManagement"
          apiEndPoint="transactionList"
          placeholder="Search by Email/Name/Txn hash"
          tableDataFunction={tableDataFunction}
          type="transactionMgmt"
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
