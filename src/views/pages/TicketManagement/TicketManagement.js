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
      color: "#fff9f966", // Apply styles to IconButton when disabled
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
      // const response = await apiRouterCall({
      //   method: "GET",
      //   paramsData: filterData,
      //   endPoint: "listAllContactUsRequest",
      // });
      // if (response.data.responseCode === 200) {
      //   setticketManagementData(response.data.result.docs);
      //   setNoOfPages({
      //     pages: response.data.result.pages,
      //     totalPages: response.data.result.total,
      //   });
      // } else {
      //   setticketManagementData([]);
      // }
      setticketManagementData([
        {
          srNo: 1,
          name: "Anjali Sharma",
          email: "anjali.sharma@example.com",
          mobile: "+91-9876543210",
          dateTime: "2025-05-01 10:30 AM",
          status: "Active",
        },
        {
          srNo: 2,
          name: "Ravi Mehta",
          email: "ravi.mehta@example.com",
          mobile: "+91-9123456780",
          dateTime: "2025-05-01 11:00 AM",
          status: "Inactive",
        },
        {
          srNo: 3,
          name: "Priya Desai",
          email: "priya.desai@example.com",
          mobile: "+91-9988776655",
          dateTime: "2025-05-02 09:15 AM",
          status: "Active",
        },
        {
          srNo: 4,
          name: "Aman Verma",
          email: "aman.verma@example.com",
          mobile: "+91-9090909090",
          dateTime: "2025-05-02 02:45 PM",
          status: "Blocked",
        },
        {
          srNo: 5,
          name: "Sneha Kulkarni",
          email: "sneha.kulkarni@example.com",
          mobile: "+91-9123412345",
          dateTime: "2025-05-03 08:00 AM",
          status: "Active",
        },
        {
          srNo: 6,
          name: "Karan Malhotra",
          email: "karan.malhotra@example.com",
          mobile: "+91-9000011111",
          dateTime: "2025-05-03 09:30 AM",
          status: "Inactive",
        },
        {
          srNo: 7,
          name: "Neha Singh",
          email: "neha.singh@example.com",
          mobile: "+91-7777888899",
          dateTime: "2025-05-03 11:45 AM",
          status: "Active",
        },
        {
          srNo: 8,
          name: "Rahul Bansal",
          email: "rahul.bansal@example.com",
          mobile: "+91-8888999900",
          dateTime: "2025-05-03 01:20 PM",
          status: "Blocked",
        },
        {
          srNo: 9,
          name: "Divya Nair",
          email: "divya.nair@example.com",
          mobile: "+91-6666777788",
          dateTime: "2025-05-03 03:10 PM",
          status: "Active",
        },
        {
          srNo: 10,
          name: "Manish Kapoor",
          email: "manish.kapoor@example.com",
          mobile: "+91-9999000011",
          dateTime: "2025-05-03 04:50 PM",
          status: "Inactive",
        },
      ])
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const sendTicketReply = async () => {
    try {
      setIsContractUpdating(true);
      console.log("_id", blockUnblockId);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "replyContactUs",
        bodyData: {
          contactUsId: blockUnblockId,
          replyMessage: reasonData?.reason,
        },
      });

      if (response.status == 200) {
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
      console.log(error);
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
                    <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                    <TableCell>{value?.name ? value?.name : "--"}</TableCell>
                    <TableCell>{value?.email ? value?.email : "--"}</TableCell>
                    <TableCell>
                      {value?.mobileNumber ? value?.mobileNumber : "--"}
                    </TableCell>
                    <TableCell>
                      {value.createdAt ? (
                        <> {moment(value.createdAt).format("lll")}</>
                      ) : (
                        "--"
                      )}
                    </TableCell>{" "}
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
