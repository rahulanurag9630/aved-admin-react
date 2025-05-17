import React, { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import { formatNumber } from "src/utils";
import TableComp from "src/component/TableComp";
import MainFilter from "src/component/MainFilter";
import axios from "axios";
import useDebounce from "src/component/customHook/Debounce";
import { CiSquareRemove } from "react-icons/ci";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import toast from "react-hot-toast";
import ViewParticularPositions from "src/component/ViewParticularPositions";
import SortAddress from "src/utils/SortAddress";
import ViewParticularOrderHistory from "src/component/ViewParticularOrderHistory";

const useStyles = makeStyles((theme) => ({
  userdashboardBox: {
    marginTop: "32px",
    "& .countBox1": {
      background: "#fff",
      borderRadius: "10px",
      padding: "30px 0px",
      transition: "0.5s",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
  },
}));

export default function TradeTableSection({ tabs, page, setPage }) {
  const classes = useStyles();
  const [isClear, setIsClear] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usermanagementData, setUsermanagementData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewParticular, setViewParticular] = useState(false);
  const [viewParticularOrder, setViewParticularOrder] = useState(false);

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
    positionStatus: tabs !== "ORDER" ? tabs : undefined,
    orderType: tabs === "ORDER" ? "OPEN" : undefined,
  };

  const tableHead = [
    {
      heading: "Sr No.",
    },
    {
      heading: "Symbol",
    },
    {
      heading: "Opened Date and Time",
    },
    {
      heading: "Type - Cross/Isolated",
    },
    {
      heading: "Side - Long/Short/Both",
    },
    {
      heading: "Size",
    },
    {
      heading: "Margine",
    },
    {
      heading: "Entry Price",
    },
    // { heading: "Breakeven Price" },
    ...(tabs === "OPEN"
      ? [
          {
            heading: "Breakeven Price",
          },
        ]
      : []),
    ...(tabs === "CLOSE"
      ? [
          {
            heading: tabs === "CLOSE" ? "Realized PNL $" : "",
          },
          {
            heading: tabs === "CLOSE" ? "R. Copiers P&L $" : "",
          },
          {
            heading: tabs === "CLOSE" ? "Avg Close Price" : "",
          },
        ]
      : []),
    {
      heading: "Number of Copiers",
    },
    {
      heading: "Copiers",
    },
    {
      heading: "Order Id",
    },
    ...(tabs === "OPEN"
      ? [
          {
            heading: tabs === "OPEN" ? "Action" : "",
          },
        ]
      : []),
  ];

  const orderHead = [
    {
      heading: "Sr No.",
    },
    {
      heading: "Date",
    },
    {
      heading: "Order Id",
    },
    {
      heading: "Client Order Id",
    },
    {
      heading: "Symbol",
    },
    // {
    //   heading: "Price (USDT)",
    // },
    {
      heading: "Profit",
    },
    {
      heading: "Quantity",
    },

    {
      heading: "Quantity (USDT)",
    },

    {
      heading: "Type",
    },

    // {
    //   heading: "Order Creation Type",
    // },
    {
      heading: "Side",
    },
    // {
    //   heading: "Stop Price",
    // },
    // {
    //   heading: "Order Status",
    // },
    // {
    //   heading: "Execution Status",
    // },
    {
      heading: "Number of Copiers",
    },
    {
      heading: "Copiers",
    },
  ];

  const getUserManagementApi = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: tabs === "ORDER" ? "orderHistoryAdmin" : "positionHistory",
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

  const handleBlockDeleteApi = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "closePosition",
        bodyData: {
          coinName: deleteBlockId ? deleteBlockId?.symbol : undefined,
          _id: deleteBlockId ? deleteBlockId?._id : undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        getUserManagementApi();
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
      arrayData?.map((value, i) =>
        tabs !== "ORDER"
          ? {
              "Sr No.": (page - 1) * 10 + i + 1,
              "Number of Copiers": value?.copyNumber,
              Symbol: value?.symbol,
              "Breakeven Price": formatNumber(value?.breakevenPrice || 0, 8),
              "Opened Date and Time": moment(value?.startTime).format("lll"),
              "Type - Cross/Isolated": value?.marginType,
              "Side - Long/Short/Both": value?.positionSide,
              Size: formatNumber(value.positionAmount || 0, 8),
              Margine: formatNumber(value.isolatedWallet || 0, 8),
              "Entry Price": formatNumber(value?.entryPrice || 0, 8),
              "Realized PNL $": formatNumber(value?.totalProfit || 0, 8),
              "R. Copiers P&L $": formatNumber(value?.copiersPnl || 0, 8),
              "Avg Close Price": formatNumber(value?.averageSell || 0, 8),
              Copiers: (
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setViewParticular(true);
                    setDeleteBlockId(value);
                  }}
                >
                  View
                </Box>
              ),
              "Order Id": value?._id,
              Action:
                tabs === "OPEN"
                  ? [
                      {
                        icon: CiSquareRemove,
                        onClick: () => {
                          setDeleteBlockId(value);
                          setModalOpen(true);
                        },
                      },
                    ]
                  : [],
            }
          : {
              "Sr No.": (page - 1) * 10 + i + 1,
              "Number of Copiers": value?.copyNumber,
              Date: moment(value?.createdAt).format("lll"),
              "Order Id": value?.orderId,
              "Client Order Id": condition ? (
                value?.clientOrderId
              ) : value?.clientOrderId ? (
                <SortAddress address={value.clientOrderId} />
              ) : (
                "..."
              ),
              Symbol: value?.symbol,
              "Price (USDT)": formatNumber(value.price || 0, 8),
              Profit: value.profit,
              Quantity: value.quantity,
              "Quantity (USDT)": formatNumber(value?.quantityInUSDT || 0, 8),
              Type: value?.type ? value?.type.toLowerCase() : "...",
              // "Order Creation Type": value?.orderCreationType,
              Side: value?.side ? value?.side.toLowerCase() : "...",
              // "Stop Price": formatNumber(value?.stopPrice || 0, 8),
              // "Order Status": value?.orderStatus,
              // "Execution Status": value?.executionStatus,
              Copiers: (
                <Box
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setViewParticularOrder(true);
                    setDeleteBlockId(value);
                  }}
                >
                  View
                </Box>
              ),
            }
      )
    );
  }

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
    <Box className={classes.userdashboardBox}>
      <MainFilter
        setSelectFilter={setSelectFilter}
        selectFilter={selectFilter}
        handleCallApi={() => {
          page > 1 && setPage(1);
          page === 1 && getUserManagementApi();
        }}
        filterData={{ ...filterData, limit: noOfPages.totalPages }}
        transactionList={usermanagementData}
        excelTableName={
          tabs === "ORDER"
            ? "orderHistoryManagement"
            : "positionHistoryManagement"
        }
        apiEndPoint={tabs === "ORDER" ? "orderHistoryAdmin" : "positionHistory"}
        type="eventMgmt"
        placeholder="Search by Symbol"
        tableDataFunction={tableDataFunction}
        handleClearApi={handleClearFilter}
      />

      <TableComp
        tableHead={tabs === "ORDER" ? orderHead : tableHead}
        scoreListData={tableDataFunction(usermanagementData)}
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
          heading={"Close All"}
          description={`Are you sure, you want to close position for all users?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          tabs={tabs === "CLOSE"}
        />
      )}
      {viewParticular && (
        <ViewParticularPositions
          openModal={viewParticular}
          handleClose={() => setViewParticular(false)}
          deleteBlockId={deleteBlockId}
          tabs={tabs}
        />
      )}
      {viewParticularOrder && (
        <ViewParticularOrderHistory
          openModal={viewParticularOrder}
          handleClose={() => setViewParticularOrder(false)}
          deleteBlockId={deleteBlockId}
        />
      )}
    </Box>
  );
}
