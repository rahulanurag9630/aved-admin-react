import React, { Fragment, useState, useEffect } from "react";
import MainFilter from "src/component/MainFilter";
import PageLoading from "src/component/PageLoading";
import {
  Box,
  TableRow,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableSortLabel,
} from "@material-ui/core";
import { formatNumber, sortAddress, sortArrayData } from "src/utils";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import Pagination from "@material-ui/lab/Pagination";
import Topheading from "src/component/TopHeading";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import { apiRouterCall } from "src/ApiConfig/service";
import moment from "moment";
import { toast } from "react-hot-toast";
import NoDataFound from "src/component/NoDataFound";
import TopTradingSkeleton from "src/component/Skeletons/TopTradingSkeleton";
import axios from "axios";
import useDebounce from "src/component/customHook/Debounce";

const useStyles = makeStyles((theme) => ({
  tableBox: {
    minWidth: "800px",
    "& .MuiTableRow-root td": {
      padding: "8px !important",
    },
    "& .MuiIconButton-root": {
      backgroundColor: "rgba(255, 255, 255, 0.025)",
      padding: "6px",
      "& td": {
        padding: "8px",
      },
      "& svg": {
        color: "#FFFFFF99",
        fontSize: "18px",
      },
    },
  },
}));

export default function UserManagment() {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("DSC");
  const [orderQuantiry, setOrderQuantiry] = useState("DSC");
  const [isLoading, setIsLoading] = useState(true);
  const [blockStatus, setblockStatus] = useState();
  const [idddd, setIdddd] = useState();
  const [isClear, setIsClear] = useState(false);
  const [isLoadingOt, setIsLoadingOt] = useState(false);
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
    sort: order,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: selectFilter.search !== "" ? selectFilter.search : undefined,
  };

  const userManagementList = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        paramsData: filterData,
        endPoint: "transactionManagement",
        source: source,
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setUserData([]);
      }
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setUserData([]);
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
        status: "All",
      });
      setPage(1);
      setIsClear(true);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) {
      userManagementList(source);
    }
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    userManagementList(source);
    return () => source.cancel();
  }, [page, order, deb, selectFilter.fromDate, selectFilter.toDate]);

  const blockAndUnblockApiHandler = async () => {
    setIsLoadingOt(true);
    try {
      const res = await apiRouterCall({
        method: "PATCH",
        endPoint: "userBlockUnblock",
        bodyData: {
          userId: idddd,
          status: blockStatus === "ACTIVE" ? "BLOCK" : "ACTIVE",
        },
      });
      if (res.data.responseCode === 200) {
        setOpenModal2(false);
        toast.success(res.data.responseMessage);
        userManagementList();
      } else {
        toast.error(res.data.responseMessage);
      }
      setIsLoadingOt(false);
    } catch (error) {
      console.log(error);
      setIsLoadingOt(false);
    }
  };

  return (
    <Box>
      <Box className="tophead">
        <Topheading heading="Minting Transaction Management" />
      </Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={(param1, param2) => {
            page > 1 && setPage(1);
            page === 1 && userManagementList(param1, param2);
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={userData}
          excelTableName="TransactionManagement"
          apiEndPoint="transactionManagement"
          type="transactionMgmt"
          placeholder="Search by IBI Name/IBI Id/Random Id/NFT Type/Wallet Address"
          handleClearApi={handleClearFilter}
        />
      </Box>

      <TableContainer>
        <Table className={classes.tableBox}>
          <TableHead>
            <TableRow alignItems="center">
              <TableCell>S.No.</TableCell>
              <TableCell>IBI Name</TableCell>
              <TableCell>IBI Id</TableCell>
              <TableCell>Wallet Address</TableCell>
              <TableCell>Random Id</TableCell>
              <TableCell>NFT Type</TableCell>
              <TableCell>NFT Price</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderQuantiry}
                  direction={orderQuantiry === "ASC" ? "dsc" : "asc"}
                  onClick={() => {
                    setOrderQuantiry(orderQuantiry === "ASC" ? "DSC" : "ASC");
                    setUserData(sortArrayData(userData, "fieroPrice"));
                  }}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell>Last Fiero Price (USD)</TableCell>
              <TableCell>
                <TableSortLabel
                  active={order}
                  direction={order === "ASC" ? "dsc" : "asc"}
                  onClick={() => setOrder(order === "ASC" ? "DSC" : "ASC")}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {userData.map((value, i) => (
              <TableRow>
                <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                <TableCell>
                  {value?.userDetails?.ibiName
                    ? value?.userDetails?.ibiName
                    : "--"}
                </TableCell>
                <TableCell>
                  {value?.userDetails?.ibiId ? value?.userDetails?.ibiId : "--"}
                </TableCell>

                <TableCell>
                  {value?.userDetails?.walletAddress &&
                  value?.userDetails?.walletAddress !== "--" ? (
                    <>
                      {sortAddress(value?.userDetails?.walletAddress)} &nbsp;
                      <CopyToClipboard text={value?.userDetails?.walletAddress}>
                        <FaRegCopy
                          size={14}
                          style={{ cursor: "pointer" }}
                          onClick={() => toast.success("Copied")}
                        />
                      </CopyToClipboard>
                    </>
                  ) : (
                    "--"
                  )}
                </TableCell>
                <TableCell>{value.MintId ? value.MintId : "--"}</TableCell>
                <TableCell>
                  {value.tokenName ? value?.tokenName : "--"}
                </TableCell>
                <TableCell>{value.nftPrice ? value.nftPrice : "--"}</TableCell>
                <TableCell>1</TableCell>
                <TableCell>
                  {value.fieroPrice ? formatNumber(value.fieroPrice, 5) : "--"}
                </TableCell>

                <TableCell>
                  {value.createdAt ? (
                    <> {moment(value.createdAt).format("lll")}</>
                  ) : (
                    "--"
                  )}
                </TableCell>
              </TableRow>
            ))}
            {isLoading &&
              Array.from({ length: 10 }).map((itm) => (
                <TopTradingSkeleton skeleton={Array.from({ length: 10 })} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLoading && userData?.length === 0 && (
        <NoDataFound text="No transaction found!" />
      )}

      <Box mt={3} mb={1} style={{ float: "right" }}>
        {!isLoading &&
          userData?.length !== 0 &&
          noOfPages?.totalPages > (page === 1 ? 10 : 0) && (
            <Pagination
              count={noOfPages?.pages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
            />
          )}
      </Box>
      <ConfirmationDialogBox
        openModal={openModal1}
        setOpenModal={setOpenModal1}
        heading="Delete Account"
        description="Are you sure, you want to delete this account?"
      />
      <ConfirmationDialogBox
        openModal={openModal2}
        setOpenModal={setOpenModal2}
        isLoading={isLoadingOt}
        apiHandler={blockAndUnblockApiHandler}
        heading={
          blockStatus === "ACTIVE" ? "Block This User" : "Unblock This User"
        }
        description={
          blockStatus === "ACTIVE"
            ? "Do you want to Block this User?"
            : "Do you want to Unblock this User?"
        }
      />
    </Box>
  );
}
