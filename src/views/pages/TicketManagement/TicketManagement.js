import {
  Box,
  IconButton,
  Typography,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Divider,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import ContactUsModal from "./ContactUsModal";
import Pagination from "@material-ui/lab/Pagination";
import MainFilter from "src/component/MainFilter";
import TopTradingSkeleton from "src/component/Skeletons/TopTradingSkeleton";
import { BsFillReplyFill } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import useDebounce from "src/component/customHook/Debounce";

const useStyles = makeStyles((theme) => ({
  "& .MuiIconButton-root.Mui-disabled": {
    color: "#fff9f966",
  },
  main__wrapper: {
    display: "flex",
    flexDirection: "column",
    "& > button": {
      margin: "10px 0",
    },
    "& .MuiIconButton-root.Mui-disabled": {
      color: "#fff9f966",
    },
    "& .MuiTabPanel-root": {
      padding: "10px 0",
    },
  },
}));

const TicketManagement = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const checkEdit = location?.state?.isEdit;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isClear, setIsClear] = useState(false);
  const [isContractUpdating, setIsContractUpdating] = useState(false);
  const [error, setError] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [ticketManagementData, setticketManagementData] = useState([]);
  const [reasonData, setReasonData] = useState({
    reason: "",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
  });
  const deb = useDebounce(selectFilter?.search, 1000);

  let filterData = {
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
  };

  const getTicketManagementList = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        paramsData: filterData,
        endPoint: "listContactUs",
        signal: source?.signal,
      });

      if (response?.data?.responseCode === 200) {
        const data = response.data.result.docs || [];

        const mappedData = data.map((item, index) => ({
          ...item,
          srNo: (page - 1) * 10 + index + 1,
        }));

        setticketManagementData(mappedData);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setticketManagementData([]);
      }

      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Error fetching ticket list: ", err);
      setticketManagementData([]);
      setIsLoading(false);
    }
  };

  const sendTicketReply = async () => {
    try {
      setIsContractUpdating(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "replyContactUs",
        paramsData: {
          _id: blockUnblockId,
          message: reasonData?.reason,
        },
      });

      if (response.status === 200) {
        toast.success("Ticket resolved successfully.");
        setIsContractUpdating(false);
        getTicketManagementList();
        setOpenReplyDialog(false);
        setReasonData({ reason: "" });
      } else {
        toast.error(response.data.message);
      }
      setIsContractUpdating(false);
    } catch (error) {
      setIsContractUpdating(false);
      toast.error(error.response.data.message);
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      getTicketManagementList(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getTicketManagementList(source);
    return () => source.cancel();
  }, [page, deb, selectFilter.fromDate, selectFilter.toDate]);

  const handleReplyModal = (_id, status) => {
    setOpenReplyDialog(true);
    setBlockUnblockId(_id);
    setBlockStatus(status);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setReasonData({ ...reasonData, reason: value });
    const errorMsg =
      value.trim() == ""
        ? "Reason is required."
        : value.length < 3
          ? "Reason must be at least 3 characters long."
          : value.length > 600
            ? "Exceeded maximum character limit (600)."
            : "";
    setError(errorMsg);
  };

  return (
    <Box className={classes.main__wrapper}>
      <Box>
        <Typography variant="h3">Ticket Management</Typography>
        <Divider className="borderBox" />
      </Box>
      <Box>
        <Box my={3}>
          <MainFilter
            setSelectFilter={setSelectFilter}
            selectFilter={selectFilter}
            handleCallApi={(param1, param2) => {
              page > 1 && setPage(1);
              page === 1 && getTicketManagementList(param1, param2);
            }}
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            transactionList={ticketManagementData}
            excelTableName="ticket-management"
            apiEndPoint="listAllContactUsRequest"
            type="transactionMgmt"
            placeholder="Search by Name/Email"
            handleClearApi={handleClearFilter}
          />
        </Box>

        <TableContainer>
          <Table className={classes.tableBox}>
            <TableHead>
              <TableRow alignItems="center">
                <TableCell>S.No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ticketManagementData &&
                ticketManagementData.map((value, i) => (
                  <TableRow>
                    <TableCell>{value?.srNo}</TableCell>
                    <TableCell>{value?.name ? value?.name : "--"}</TableCell>
                    <TableCell>{value?.email ? value?.email : "--"}</TableCell>
                    <TableCell>
                      {value?.phoneNumber ? value?.phoneNumber : "--"}
                    </TableCell>
                    <TableCell>
                      {value?.createdAt ? (
                        <> {moment(value.createdAt).format("lll")}</>
                      ) : (
                        "--"
                      )}
                    </TableCell>
                    <TableCell>{value?.isReply ? "Closed" : "Open"}</TableCell>
                    <TableCell>
                      <Box key={value._id} className="displayCenter">
                        <IconButton
                          onClick={() =>
                            history.push("/pending-ticket", {
                              state: value,
                            })
                          }
                        >
                          <IoMdEye style={{ color: "#475569" }} />
                        </IconButton>
                        {checkEdit && !value?.isReply && (
                          <IconButton
                            style={{
                              pointerEvents: value?.isReply ? "none" : "auto",
                            }}
                            onClick={() => {
                              handleReplyModal(value?._id, value?.isReply);
                            }}
                          >
                            <BsFillReplyFill style={{ color: "#475569 " }} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading &&
                Array.from({ length: 10 }).map((itm) => (
                  <TopTradingSkeleton skeleton={Array.from({ length: 7 })} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading &&
          ticketManagementData &&
          ticketManagementData?.length === 0 && (
            <NoDataFound data={"No data found!"} />
          )}
        {!isLoading && noOfPages?.pages > 1 && (
          <Box elevation={2} mt={3} mb={1} style={{ float: "right" }}>
            <Pagination
              count={noOfPages?.pages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Box>
        )}
      </Box>

      {openReplyDialog && (
        <ContactUsModal
          open={openReplyDialog}
          isLoading={isContractUpdating}
          handleClose={() => {
            setOpenReplyDialog(false);
          }}
          filter={reasonData}
          setFilter={(data) => {
            setReasonData(data);
          }}
          title={"Reply"}
          desc={"Please Enter The Solution Description"}
          error={error}
          handleSubmit={(item) => {
            handleChange({ target: { value: reasonData?.reason } });
            if (error == "" && reasonData.reason !== "") {
              sendTicketReply(item);
            }
          }}
          status={blockStatus}
          typeContact="contactUs"
        />
      )}
    </Box>
  );
};

export default TicketManagement;
