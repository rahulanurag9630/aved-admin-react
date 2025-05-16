import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import Topheading from "src/component/TopHeading";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import useDebounce from "src/component/customHook/Debounce";
import { capitalizeFirstLetter, formatNumber } from "src/utils";
import { MdBlockFlipped, MdOutlineIndeterminateCheckBox } from "react-icons/md";
import toast from "react-hot-toast";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import { GrDocumentVerified } from "react-icons/gr";

const tableHead = [
  {
    heading: "Sr No.",
  },
  {
    heading: "User Email",
  },
  {
    heading: "Exchange",
  },
  {
    heading: "Balance",
  },
  {
    heading: "Fuel Wallet",
  },
  {
    heading: "Loss Wallet",
  },
  {
    heading: "Status",
  },
  {
    heading: "Action",
  },
];

export default function ApiManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activityData, setActivityData] = useState([]);
  const [isClear, setIsClear] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [modalOpen, setModalOpen] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
        endPoint: "userExchangeData",
        source: source,
        paramsData: filterData,
        token: localStorage.getItem("token"),
      });
      if (response.data.responseCode === 200) {
        setActivityData(response?.data?.result?.docs);
        setNoOfPages({
          pages: response?.data?.result?.pages,
          totalPages: response?.data?.result?.total,
        });
      } else {
        setActivityData([]);
      }
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  const handlePerformAction = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "userExchangeManagement",
        bodyData: {
          userId: deleteBlockId ? deleteBlockId?.userId : undefined,
          copyTradingStatus: modalOpen,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        getSubAdminActivity();
        setModalOpen("");
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
    return arrayData?.map((value, i) => ({
      "Sr No.": (page - 1) * 10 + i + 1,
      "User Email": value?.email,
      Exchange: value?.exchangeName,
      Balance: `${formatNumber(value?.binanceBalance || 0, 8)}`,
      "Fuel Wallet": `${formatNumber(value?.fuelBalance || 0, 8)}`,
      "Loss Wallet": `${formatNumber(value?.tradeTotalLossWallet || 0, 8)}`,
      Status: value?.isSuspended
        ? "Suspended"
        : value?.copyTrading
        ? "Active"
        : "Inactive",
      Action: [
        ...(value?.isSuspended
          ? [
              {
                icon: GrDocumentVerified,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("ACTIVE");
                },
                title: "Active",
              },
              {
                icon: MdBlockFlipped,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("INACTIVE");
                },
                title: "Inactive",
              },
            ]
          : value?.copyTrading
          ? [
              {
                icon: MdBlockFlipped,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("INACTIVE");
                },
                title: "Inactive",
              },
              {
                icon: MdOutlineIndeterminateCheckBox,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("SUSPENDED");
                },
                title: "Suspended",
              },
            ]
          : [
              {
                icon: GrDocumentVerified,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("ACTIVE");
                },
                title: "Active",
              },
              {
                icon: MdOutlineIndeterminateCheckBox,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("SUSPENDED");
                },
                title: "Suspended",
              },
            ]),
      ],
    }));
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
        <Topheading heading="Api Management" />
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
          apiEndPoint="userExchangeData"
          placeholder="Search by email"
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
      {modalOpen && (
        <ConfirmationDialogBox
          openModal={["ACTIVE", "INACTIVE", "SUSPENDED"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={capitalizeFirstLetter(modalOpen)}
          description={`Are you sure, you want to ${modalOpen.toLocaleLowerCase()} copytrading?`}
          HandleConfirm={handlePerformAction}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
