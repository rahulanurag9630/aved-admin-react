import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
import useDebounce from "src/component/customHook/Debounce";
import { FaUser } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  userdashboardBox: {
    "& .countBox1": {
      background: "#252233",
      borderRadius: "10px",
      padding: "20px",
      transition: "0.5s",
      border: "1px solid #80808029",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    },
  },
}));
const tableHead = [
  {
    heading: "Sr No.",
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
    heading: "First Name",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Last Name",
    column: 0,
    isMobile: true,
  },

  {
    heading: "Mobile Number",
    column: 1,
    isMobile: false,
  },
  {
    heading: "Gender",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Registration Date & Time",
    column: 2,
    isMobile: true,
  },
  {
    heading: "DOB",
    column: 2,
    isMobile: true,
  },
  
  {
    heading: "Status",
    column: 2,
    isMobile: true,
    isNotShow: false,
  },
  // {
  //   heading: "barStatus",
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

export default function UserManagment() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const checkEdit = location?.state?.isEdit;
  const [isClear, setIsClear] = useState(false);
  const [usermanagementData, setUsermanagementData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "All",
    walletStatus: "All",
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
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
    walletStatus:
      selectFilter.walletStatus !== "All"
        ? selectFilter.walletStatus
        : undefined,
    userType1: "USER",
  };

  const arrayDataCard = [
    {
      title: "Total Users",
      count: dashboardData?.todayCountActive,
      color: "#846cf9cc",
      background1: "rgb(132 108 249 / 17%)",
    },
    {
      title: "Total Active Users",
      count: dashboardData?.sevenDaysActive,
      color: "rgb(39 195 87)",
      background1: "rgb(39 195 87 / 19%)",

    },
    {
      title: "Total Blocked Users",
      count: dashboardData?.monthlyActive,
      color: "#ffb153",
      background1: "rgb(255 177 83 / 19%)",
     
    },
    {
      title: "Total Verified Users",
      count: dashboardData?.totalUsersActive,
      color: "rgb(55 226 235)",
      background1: "rgb(55 226 235 / 16%)",
    },
  ];

  const activatedarrayData = [
    {
      title: "Total Users",
      count: dashboardData?.todayCountActive,
      color: "#846cf9cc",
      background1: "rgb(132 108 249 / 17%)",
    },
    {
      title: "Total Active Users",
      count: dashboardData?.sevenDaysActive,
      color: "#ffb153",
      background1: "rgb(255 177 83 / 19%)",
    },
    {
      title: "Total Blocked Users",
      count: dashboardData?.monthlyActive,
      color: "rgb(39 195 87)",
      background1: "rgb(39 195 87 / 19%)",
    },
    {
      title: "Total Verified Users",
      count: dashboardData?.totalUsersActive,
      color: "rgb(55 226 235)",
      background1: "rgb(55 226 235 / 16%)",
    },
  ];

  const getUserManagementApi = async (source, checkFilter) => {
    try {
      // const response = await apiRouterCall({
      //   method: "GET",
      //   endPoint: "getUserList",
      //   source: source,
      //   paramsData: filterData,
      //   token: localStorage.getItem("token"),
      // });
      // if (response.data.responseCode === 200) {
      //   setUsermanagementData(response.data.result.docs);
      //   setNoOfPages({
      //     pages: response.data.result.pages,
      //     totalPages: response.data.result.total,
      //   });
      // } else {
      //   setUsermanagementData([]);
      // }
      // setIsClear(false);
      // setIsLoading(false);
      setUsermanagementData([
        {
          srNo: 1,
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          mobileNumber: "9876543210",
          gender: "Male",
          registrationDateTime: "2025-05-01 10:30 AM",
          dob: "1990-01-01",
          status: "Active",
          action: "View",
        },
        {
          srNo: 2,
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          mobileNumber: "8765432109",
          gender: "Female",
          registrationDateTime: "2025-04-30 09:15 AM",
          dob: "1992-06-15",
          status: "Inactive",
          action: "Edit",
        },
        {
          srNo: 3,
          email: "robert.jones@example.com",
          firstName: "Robert",
          lastName: "Jones",
          mobileNumber: "7654321098",
          gender: "Male",
          registrationDateTime: "2025-04-29 08:00 PM",
          dob: "1988-11-23",
          status: "Active",
          action: "Delete",
        },
        {
          srNo: 4,
          email: "lisa.wilson@example.com",
          firstName: "Lisa",
          lastName: "Wilson",
          mobileNumber: "6543210987",
          gender: "Female",
          registrationDateTime: "2025-04-28 07:45 PM",
          dob: "1995-03-10",
          status: "Pending",
          action: "Approve",
        },
        {
          srNo: 5,
          email: "david.brown@example.com",
          firstName: "David",
          lastName: "Brown",
          mobileNumber: "5432109876",
          gender: "Male",
          registrationDateTime: "2025-04-27 11:20 AM",
          dob: "1991-08-19",
          status: "Blocked",
          action: "Unblock",
        },
        {
          srNo: 6,
          email: "emma.davis@example.com",
          firstName: "Emma",
          lastName: "Davis",
          mobileNumber: "4321098765",
          gender: "Female",
          registrationDateTime: "2025-04-26 04:30 PM",
          dob: "1994-12-05",
          status: "Active",
          action: "Suspend",
        },
        {
          srNo: 7,
          email: "michael.miller@example.com",
          firstName: "Michael",
          lastName: "Miller",
          mobileNumber: "3210987654",
          gender: "Male",
          registrationDateTime: "2025-04-25 02:00 PM",
          dob: "1987-07-17",
          status: "Inactive",
          action: "Edit",
        },
        {
          srNo: 8,
          email: "olivia.garcia@example.com",
          firstName: "Olivia",
          lastName: "Garcia",
          mobileNumber: "2109876543",
          gender: "Female",
          registrationDateTime: "2025-04-24 09:10 AM",
          dob: "1993-09-30",
          status: "Active",
          action: "View",
        },
        {
          srNo: 9,
          email: "william.martin@example.com",
          firstName: "William",
          lastName: "Martin",
          mobileNumber: "1098765432",
          gender: "Male",
          registrationDateTime: "2025-04-23 06:25 PM",
          dob: "1990-04-22",
          status: "Pending",
          action: "Approve",
        },
        {
          srNo: 10,
          email: "sophia.thompson@example.com",
          firstName: "Sophia",
          lastName: "Thompson",
          mobileNumber: "9988776655",
          gender: "Female",
          registrationDateTime: "2025-04-22 03:55 PM",
          dob: "1996-10-11",
          status: "Active",
          action: "Delete",
        },
      ])
    } catch (err) {
      setUsermanagementData([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleBlockDeleteApi = async (reason) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "blockUnblockUser",
        bodyData: {
          _id: deleteBlockId ? deleteBlockId?._id : undefined,
          reason: reason || undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setModalOpen(false);
        getUserManagementApi();
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
      arrayData.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Email: value.email,
        "First Name": value.firstName,
        "Last Name": value.lastName,
        "Mobile Number": value.mobileNumber,
        Gender: value.gender,
        "Registration Date & Time": value.registrationDateTime
          ? moment(value.registrationDateTime).format("lll")
          : "...",
        DOB: value.dob,
        Status: condition ? (
          value.status
        ) : (
          <Box
            style={{
              color: value.status === "Active" ? "#0CA51C" : "#EF2114",
            }}
          >
            {value.status === "Blocked" ? "BLOCKED" : value.status}
          </Box>
        ),
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () => {
              history.push({
                pathname: "/user-profile",
                state: value,
              });
            },
          },
          ...(checkEdit
            ? [
                {
                  icon: BlockIcon,
                  onClick: () => {
                    setDeleteBlockId(value);
                    setModalOpen(true);
                  },
                },
              ]
            : []),
        ],
      }))
    );
  }
  

  const getDashboardData = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "userData",
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

  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({
        fromDate: null,
        toDate: null,
        search: "",
        status: "All",
        walletStatus: "All",
      });
      setPage(1);
      setIsClear(true);
    }
  };

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
  }, [
    page,
    deb,
    selectFilter.fromDate,
    selectFilter.toDate,
    selectFilter.status,
    selectFilter.walletStatus,
  ]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getDashboardData(source);
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <Box className={classes.userdashboardBox}>
      <Box className="tophead">
        <Topheading heading="User management" />
      </Box>

    
      <Box mt={1.5}>
        <Grid container spacing={2}>
          {!isLoading &&
            arrayDataCard?.map((value) => (
              <Grid item xs={12} sm={6} md={3}>
                <Box className="countBox1" align="center">
                  <Box
                    align="center"
                    className="displayCenter"
                    mb={1}
                    style={{
                      background: value.background1,
                      width: "50px",
                      height: "50px",
                      borderRadius: "100%",
                    }}
                  >
                    {" "}
                    <FaUser
                      style={{
                        fontSize: "20px",
                        color: value.color || "#000", // Fallback to black if color is undefined
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    className="trimText"
                    style={{ color: "#fff !important" }}
                  >
                    {value?.title}
                  </Typography>
                  <Box mt={1}>
                    <Typography
                      variant="body2"
                      color="primary"
                      className="countBox2"
                      style={{
                        fontWeight: "600",
                        fontSize: "20px",
                        color: value.color || "#000", // Fallback to black if color is undefined
                      }}
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
            page === 1 && getUserManagementApi();
          }}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={usermanagementData}
          excelTableName="UserManagement"
          apiEndPoint="getUserList"
          type="userList"
          placeholder="Search by Email/First Name/Last Name"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>
      <TableComp
        isMobileAdaptive={true}
        tableHead={tableHead}
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
          heading={`${
            deleteBlockId.status !== "BLOCK" ? "Block" : "Unblock"
          } User`}
          description={`Are you sure, you want to ${
            deleteBlockId.status !== "BLOCK" ? "Block" : "Unblock"
          } User?`}
          HandleConfirm={(data) => handleBlockDeleteApi(data)}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
