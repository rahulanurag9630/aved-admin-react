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
    heading: "Title",
    column: 0,
    isMobile: true,
  },
  {
    heading: "Desctiption",
    column: 0,
    isMobile: true,
    isCopy: true,
  },
  {
    heading: "Created Date & Time",
    column: 1,
    isMobile: true,
  },
  
  {
    heading: "Action",
    column: 1,
    isMobile: true,
  },
];

export default function Tips() {
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
      // setIsClear(false);
      // setIsLoading(false);
      setTransactionList([
        {
          id: 1,
          title: "Stay Hydrated",
          description: "Drink at least 8 glasses of water a day to maintain hydration.",
          createdAt: "2025-05-03 10:15 AM",
        },
        {
          id: 2,
          title: "Daily Exercise",
          description: "Engage in at least 30 minutes of physical activity every day.",
          createdAt: "2025-05-02 09:00 AM",
        },
        {
          id: 3,
          title: "Balanced Diet",
          description: "Include fruits, vegetables, and proteins in your daily meals.",
          createdAt: "2025-05-01 08:30 AM",
        },
        {
          id: 4,
          title: "Sleep Well",
          description: "Aim for 7–9 hours of sleep each night to stay healthy.",
          createdAt: "2025-04-30 11:00 PM",
        },
        {
          id: 5,
          title: "Read Books",
          description: "Reading for 20 minutes daily helps stimulate the brain.",
          createdAt: "2025-04-29 07:45 PM",
        },
        {
          id: 6,
          title: "Limit Screen Time",
          description: "Take breaks from screens every hour to reduce eye strain.",
          createdAt: "2025-04-28 04:20 PM",
        },
        {
          id: 7,
          title: "Meditate",
          description: "Meditation helps reduce stress and improve focus.",
          createdAt: "2025-04-27 06:00 AM",
        },
        {
          id: 8,
          title: "Practice Gratitude",
          description: "Write down three things you're grateful for each day.",
          createdAt: "2025-04-26 10:10 AM",
        },
        {
          id: 9,
          title: "Stay Organized",
          description: "Use a planner to keep track of your daily tasks and goals.",
          createdAt: "2025-04-25 01:30 PM",
        },
        {
          id: 10,
          title: "Connect with Nature",
          description: "Spend time outdoors to improve mental well-being.",
          createdAt: "2025-04-24 03:15 PM",
        },
      ]);
    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
    finally{
       setIsClear(false);
      setIsLoading(false);
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
   console.log("arrayData", arrayData);
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Title: value?.title,
        Desctiption: value?.description,
        "Created Date & Time": value?.createdAt,
     
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/add-tips",
                state: { ...value, viewSubAdmin: true },
              }),
          },
          ...(checkEdit
            ? [
                {
                  icon: FaEdit,
                  onClick: () =>
                    history.push({
                      pathname: "/add-tips",
                      state: { ...value, editSubAdmin: true },
                    }),
                },
                {
                  icon: BlockIcon,
                  onClick: () => {
                    setDeleteBlockId(value);
                    setModalOpen("block");
                  },
                },
                {
                  icon: DeleteIcon,
                  onClick: () => {
                    setDeleteBlockId(value);
                    setModalOpen("delete");
                  },
                },
              ]
            : []),
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
          heading="Tips & Events Management"
          pathname={checkEdit ? "/add-tips" : undefined}
          addButton={"Add New Tip"}
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
          placeholder="Search by title"
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
          } Tip`}
          description={`Are you sure, you want to ${
            modalOpen === "delete"
              ? "Delete"
              : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
          } this tip?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription={"Are you sure, you want to block this tip?"}
          showBlock={true}
        />
      )}
    </Box>
  );
}
