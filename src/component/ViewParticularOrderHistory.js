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
import SortAddress from "src/utils/SortAddress";

const useStyles = makeStyles(() => ({
  dialougTitle: {
    minHeight: "calc(100vh - 300px)",
    "& .ubuntu": {
      marginBottom: "10px",
    },
  },
}));

export default function ViewParticularOrderHistory({
  openModal,
  handleClose,
  deleteBlockId,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [usermanagementData, setUsermanagementData] = useState([]);

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  let filterData = {
    page: page,
    limit: 10,
    parentOrderId: deleteBlockId?.orderId,
  };

  const orderHead = [
    {
      heading: "Sr No.",
    },
    {
      heading: "Email",
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
    {
      heading: "Price (USDT)",
    },
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
  ];

  const getUserManagementApi = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "orderHistoryAdmin",
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

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Email: value?.userId?.email,
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
              tableHead={orderHead}
              scoreListData={tableDataFunction(usermanagementData)}
              noOfPages={noOfPages}
              page={page}
              setPage={setPage}
              NoDataFoundText="default"
              isLoading={isLoading}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
