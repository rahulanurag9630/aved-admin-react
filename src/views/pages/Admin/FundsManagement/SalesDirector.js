import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import CommonAddressCom from "src/component/CommonAddressCom";
import axios from "axios";
import { CiSquareRemove } from "react-icons/ci";
import toast from "react-hot-toast";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import useDebounce from "src/component/customHook/Debounce";

const tableHead = [
  {
    heading: "Sr No.",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Name",
    column: 0,
    isMobile: true,
    // isCopy: true,
  },
  {
    heading: "Pool Name",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Wallet Address",
    column: 0,
    isMobile: true,
    // isCopy: true,
  },
  {
    heading: "Date & Time",
    column: 2,
    isMobile: true,
    // isNotShow: false,
  },
  // {
  //   heading: "barStatus",
  //   column: 2,
  //   isMobile: true,
  //   isNotShow: false,
  // },

  // {
  //   heading: "barStatus1",
  //   column: 2,
  //   isMobile: true,
  //   isNotShow: false,
  // },
  {
    heading: "Action",
    column: 2,
    isMobile: true,
    isNotShow: false,
  },
];

export default function SalesDirector({ tabs }) {
  const location = useLocation();
  const checkEdit = location?.state?.isEdit;
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isClear, setIsClear] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

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
    poolName: selectFilter.status !== "All" ? selectFilter.status : undefined,
  };

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      setIsLoading(true);
      setTransactionList([]);
      const response = await apiRouterCall({
        endPoint: "getWhiteListedAddress",
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

  const handleBlockDeleteApi = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "removeWhiteListedAddress",
        bodyData: {
          addressedId: deleteBlockId ? deleteBlockId?._id : undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        page > 1 ? setPage((prePage) => prePage - 1) : handleGetTransaction();
        setModalOpen(false);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Name: value?.userName,
        "Pool Name": value?.poolName,
        "Wallet Address": condition ? (
          value.walletAddress
        ) : value.walletAddress ? (
          <CommonAddressCom text={value.walletAddress} />
        ) : (
          "..."
        ),
        "Date & Time": moment(value?.createdAt).format("ll"),
        [checkEdit ? "Action" : ""]: [
          {
            icon: CiSquareRemove,
            onClick: () => {
              setDeleteBlockId(value);
              setModalOpen(true);
            },
          },
        ],
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
    tabs,
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
          apiEndPoint="getWhiteListedAddress"
          placeholder="Search by Username/Address"
          tableDataFunction={tableDataFunction}
          type="rewardMgmt"
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
      {modalOpen && (
        <ConfirmationDialogBox
          openModal={modalOpen}
          handleClose={() => setModalOpen(false)}
          heading={"Remove whitelist"}
          description={`Are you sure, you want to remove whitelist?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
