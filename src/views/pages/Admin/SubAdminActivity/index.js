import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import Topheading from "src/component/TopHeading";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import useDebounce from "src/component/customHook/Debounce";

const tableHead = [
  {
    heading: "Sr No.",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Sub-admin Name",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Email",
    column: 0,
    isMobile: true,
    isCopy: true,
  },
  {
    heading: "Module",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Activity",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Date & Time",
    column: 1,
    isMobile: true,
  },
];

export default function SubAdminActivity() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activityData, setActivityData] = useState([]);
  const [isClear, setIsClear] = useState(false);

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
  };

  const getSubAdminActivity = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        endPoint: "subAdminActivityList",
        source: source,
        paramsData: filterData,
        token: localStorage.getItem("token"),
      });
      if (response.data.responseCode === 200) {
        setActivityData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setActivityData([]);
      }
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setActivityData([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        "Sub-admin Name": value?.name,
        Email: value?.email,
        Module: value?.module,
        Activity: value?.activity,
        "Date & Time": moment(value?.createdAt).format("lll"),
      }))
    );
  }

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

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      getSubAdminActivity(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getSubAdminActivity(source);
    return () => {
      source.cancel();
    };
  }, [page, deb, selectFilter.fromDate, selectFilter.toDate]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading heading="Sub-Admin Activity" />
      </Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => {
            page > 1 && setPage(1);
            page === 1 && getSubAdminActivity();
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={activityData}
          excelTableName="SubAdminActivity"
          apiEndPoint="subAdminActivityList"
          placeholder="Search by Name"
          type="transactionMgmt"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>
      <TableComp
        isMobileAdaptive={true}
        tableHead={tableHead}
        scoreListData={tableDataFunction(activityData)}
        noOfPages={noOfPages}
        page={page}
        setPage={setPage}
        NoDataFoundText="default"
        isLoading={isLoading}
      />
    </Box>
  );
}
