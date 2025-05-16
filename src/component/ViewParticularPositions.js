import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { RxCross2 } from "react-icons/rx";
import TableComp from "./TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import { formatNumber } from "src/utils";
import axios from "axios";
import ConfirmationDialogBox from "./ConfirmationDialogBox";
import { CiSquareRemove } from "react-icons/ci";
import toast from "react-hot-toast";

const useStyles = makeStyles(() => ({
  dialougTitle: {
    minHeight: "calc(100vh - 300px)",
    "& .ubuntu": {
      marginBottom: "10px",
    },
  },
}));

export default function ViewParticularPositions({
  openModal,
  handleClose,
  deleteBlockId,
  tabs,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [usermanagementData, setUsermanagementData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewData, setViewData] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  let filterData = {
    page: page,
    limit: 10,
    parentPositionId: deleteBlockId?._id,
  };

  const tableHead = [
    {
      heading: "Sr No.",
    },
    {
      heading: "Email",
    },
    {
      heading: "Symbol",
    },
    {
      heading: "Opened Date and Time",
    },
    ...(tabs === "OPEN"
      ? [
          {
            heading: tabs === "OPEN" ? "Breakeven Price" : "",
          },
        ]
      : []),

    ...(tabs === "CLOSE"
      ? [
          {
            heading: tabs === "CLOSE" ? "Realized PNL $" : "",
          },
          // {
          //   heading: tabs === "CLOSE" ? "R. Copiers P&L $" : "",
          // },
          {
            heading: tabs === "CLOSE" ? "Avg Close Price" : "",
          },
        ]
      : []),
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

  const getUserManagementApi = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "positionHistory",
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
      setIsLoading(false);
    } catch (err) {
      setUsermanagementData([]);
      setIsLoading(false);
      console.log(err);
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
          userId: viewData ? viewData?.userId : undefined,
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
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Email: value?.userId?.email,
        "Breakeven Price": formatNumber(value?.breakevenPrice || 0, 8),
        Symbol: value?.symbol,
        "Opened Date and Time": moment(value?.startTime).format("lll"),
        "Type - Cross/Isolated": value?.marginType,
        "Side - Long/Short/Both": value?.positionSide,
        Size: formatNumber(value.positionAmount || 0, 8),
        Margine: formatNumber(value.isolatedWallet || 0, 8),
        "Entry Price": formatNumber(value?.entryPrice || 0, 8),
        "Realized PNL $": formatNumber(value?.totalProfit || 0, 8),
        // "R. Copiers P&L $": formatNumber(value?.copiersPnl || 0, 8),
        "Avg Close Price": formatNumber(value?.averageSell || 0, 8),
        "Order Id": value?._id,
        Action:
          tabs === "OPEN" && value?.positionStatus === "OPEN"
            ? [
                {
                  icon: CiSquareRemove,
                  onClick: () => {
                    setViewData(value);
                    setModalOpen(true);
                  },
                },
              ]
            : [],
      }))
    );
  }

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (deleteBlockId?._id) {
      getUserManagementApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [page, deleteBlockId]);

  return (
    <div>
      <Dialog
        maxWidth="lg"
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => !isLoading && handleClose()}
      >
        <DialogTitle>
          <IconButton
            disabled={isLoading}
            onClick={() => handleClose()}
            className="closeButton"
          >
            <RxCross2 />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box className={classes.dialougTitle} align="center">
            <Typography className="ubuntu" variant="h4" color="primary">
              View Copiers
            </Typography>

            <TableComp
              tableHead={tableHead}
              scoreListData={tableDataFunction(usermanagementData)}
              noOfPages={noOfPages}
              page={page}
              setPage={setPage}
              NoDataFoundText="default"
              isLoading={isLoading}
            />
          </Box>
          {modalOpen && (
            <ConfirmationDialogBox
              openModal={modalOpen}
              handleClose={() => setModalOpen(false)}
              heading={"Close All"}
              description={`Are you sure, you want to close this position?`}
              HandleConfirm={handleBlockDeleteApi}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
