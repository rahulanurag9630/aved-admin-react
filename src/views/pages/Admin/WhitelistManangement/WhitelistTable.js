import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box, Button, makeStyles, Grid, Typography } from "@material-ui/core";
import Topheading from "src/component/TopHeading";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import CommonAddressCom from "src/component/CommonAddressCom";
import AddWhitelistModal from "src/component/AddWhitelistModal";
import { CiSquareRemove } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import useDebounce from "src/component/customHook/Debounce";
const useStyles = makeStyles((theme) => ({
  userdashboardBox: {
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
const tableHead = [
  {
    heading: "Sr No.",
  },
  {
    heading: "Name",
  },
  {
    heading: "Pool Name",
  },
  {
    heading: "Wallet Address",
  },
  {
    heading: "Addition Date & Time",
  },
  {
    heading: "Action",
  },
];

export default function UserManagment() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const checkEdit = location?.state?.isEdit;
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [addWhiteListModal, setAddWhiteListModal] = useState(false);
  const [dashboardData, setDashboardData] = useState();

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
  };

  const activatedarrayData = [
    {
      title: "Sales Manager",
      count: dashboardData?.manager,
    },
    {
      title: "Sales Director",
      count: dashboardData?.director,
    },
    {
      title: "Group Vice President",
      count: dashboardData?.groupVp,
    },
  ];

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "getWhiteListedAddress",
        source: source,
        paramsData: filterData,
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
        "Addition Date & Time": moment(value?.createdAt).format("lll"),
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

  const getDashboardData = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "poolData",
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setDashboardData(response.data.result);
      } else {
        setDashboardData();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDashboardData(source);
    return () => {
      source.cancel();
    };
  }, []);

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
    deb,
    selectFilter.fromDate,
    selectFilter.toDate,
    selectFilter.status,
  ]);

  return (
    <Box className={classes.userdashboardBox}>
      <Box className="tophead displaySpacebetween">
        <Topheading heading="Whitelist Management" />
        <Button
          variant="contained"
          color="secondary"
          className="transparentbutton"
          onClick={() => setAddWhiteListModal(true)}
        >
          Add Whitelist
        </Button>
      </Box>

      <Box mt={1.5} mb={4}>
        <Grid container spacing={2}>
          {activatedarrayData?.map((value) => (
            <Grid item xs={12} sm={6} md={4}>
              <Box className="countBox1" align="center">
                <Typography
                  variant="subtitle1"
                  color="primary"
                  className="trimText"
                >
                  {value?.title}
                </Typography>
                <Box mt={3}>
                  <Typography
                    variant="body2"
                    color="primary"
                    className="countBox"
                  >
                    {value?.count || "0"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

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
          excelTableName="SubAdminManagement"
          apiEndPoint="getWhiteListedAddress"
          placeholder="Search by Email/Address"
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

      {addWhiteListModal && (
        <AddWhitelistModal
          openModal={addWhiteListModal}
          handleClose={() => setAddWhiteListModal(false)}
          callBack={handleGetTransaction}
        />
      )}
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
