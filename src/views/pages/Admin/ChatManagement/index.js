import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import useDebounce from "src/component/customHook/Debounce";

const tableHead = [
  {
    heading: "Sr No.",
    column: 0,
    isMobile: true,
  },
  {
    heading: "User 1",
    column: 0,
    isMobile: true,
  },
  {
    heading: "User 2",
    column: 0,
    isMobile: true,
    isCopy: true,
  },
  {
    heading: "Last Chatting",
    column: 1,
    isMobile: true,
  },
  {
    heading: "Action",
    column: 1,
    isMobile: true,
  },
];

export default function UserManagment() {
  const history = useHistory();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState("");
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const checkEdit = location?.state?.isEdit;
  console.log("checkEdit", checkEdit);

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
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
    userType1: "SUBADMIN",
  };

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      // const response = await apiRouterCall({
      //   method: "GET",
      //   endPoint: "getUserList",
      //   source: source,
      //   paramsData: filterData,
      // });
      // if (response.data.responseCode === 200) {
      //   setTransactionList(response.data.result.docs);
      //   setNoOfPages({
      //     pages: response.data.result.pages,
      //     totalPages: response.data.result.total,
      //   });
      // } else {
      //   setTransactionList([]);
      // }
      setTransactionList([
        {
          srNo: 1,
          user1: "Alice Johnson",
          user2: "Bob Smith",
          lastChatting: "2025-05-02 3:12 PM",
          action: "View",
        },
        {
          srNo: 2,
          user1: "Charlie Brown",
          user2: "Daisy Ridley",
          lastChatting: "2025-05-01 10:45 AM",
          action: "View",
        },
        {
          srNo: 3,
          user1: "Eve Adams",
          user2: "Frank Wright",
          lastChatting: "2025-04-30 8:00 PM",
          action: "View",
        },
        {
          srNo: 4,
          user1: "Grace Lee",
          user2: "Henry Ford",
          lastChatting: "2025-04-29 6:30 PM",
          action: "View",
        },
        {
          srNo: 5,
          user1: "Isla Fisher",
          user2: "Jack Ryan",
          lastChatting: "2025-04-29 1:10 PM",
          action: "View",
        },
        {
          srNo: 6,
          user1: "Karen Gillan",
          user2: "Liam Neeson",
          lastChatting: "2025-04-28 4:05 PM",
          action: "View",
        },
        {
          srNo: 7,
          user1: "Megan Fox",
          user2: "Noah Centineo",
          lastChatting: "2025-04-27 9:50 AM",
          action: "View",
        },
        {
          srNo: 8,
          user1: "Olivia Wilde",
          user2: "Peter Parker",
          lastChatting: "2025-04-27 11:15 AM",
          action: "View",
        },
        {
          srNo: 9,
          user1: "Quincy Jones",
          user2: "Rachel Green",
          lastChatting: "2025-04-26 7:40 PM",
          action: "View",
        },
        {
          srNo: 10,
          user1: "Steve Jobs",
          user2: "Tony Stark",
          lastChatting: "2025-04-25 5:00 PM",
          action: "View",
        },
      ]
      );
      setIsClear(false);
      setIsLoading(false);
    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleBlockDeleteApi = async (reason) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: modalOpen === "delete" ? "DELETE" : "PUT",
        endPoint: modalOpen === "delete" ? "deleteUser" : "blockUnblockUser",
        bodyData: {
          _id: deleteBlockId ? deleteBlockId?._id : undefined,
          reason: reason || undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        modalOpen !== "delete" && handleGetTransaction();
        setModalOpen("");
        modalOpen === "delete" && page > 1
          ? setPage((prePage) => prePage - 1)
          : handleGetTransaction();
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
        "User 1": value?.user1,
        "User 2": value?.user2,
        "Last Chatting" :value?.lastChatting,
       
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/view-chat",
                state: { ...value, viewSubAdmin: true },
              }),
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
    deb,
    selectFilter.fromDate,
    selectFilter.toDate,
    selectFilter.status,
  ]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading
          heading="Chat Management"
          
        />
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
          apiEndPoint="getUserList"
          placeholder="Search by Name"
          tableDataFunction={tableDataFunction}
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
          openModal={["delete", "block"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={`${
            modalOpen === "delete"
              ? "Delete"
              : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
          } Sub Admin`}
          description={`Are you sure, you want to ${
            modalOpen === "delete"
              ? "Delete"
              : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
          } this Account?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
