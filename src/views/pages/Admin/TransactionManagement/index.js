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
import TransactionDetailModal from "./Detail";

const tableHead = [
    {
      heading: "Sr No.",
      column: 0,
      isMobile: true,
    },
    {
        heading: "Trx Id",
        column: 0,
        isMobile: true,
      },
    {
      heading: "User Name",
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
      heading: "Plan Title",
      column: 0,
      isMobile: true,
    },
    {
      heading: "Price",
      column: 0,
      isMobile: true,
    },
    {
      heading: "Duration",
      column: 0,
      isMobile: true,
    },
    {
      heading: "Purchase Date",
      column: 1,
      isMobile: true,
    },
    {
      heading: "Expiry Date",
      column: 1,
      isMobile: true,
    },
    {
      heading: "Status",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          srNo: 1,
          trxId: "TRX123456",
          userName: "Anjali Sharma",
          email: "anjali.sharma@example.com",
          planTitle: "Premium Plan",
          price: "999",
          duration: "30 days",
          purchaseDate: "2025-04-01 10:15 AM",
          expiryDate: "2025-05-01 10:15 AM",
          status: "Active",
        },
        {
          srNo: 2,
          trxId: "TRX123456",

          userName: "Ravi Mehta",
          email: "ravi.mehta@example.com",
          planTitle: "Standard Plan",
          price: "499",
          duration: "15 days",
          purchaseDate: "2025-04-15 03:30 PM",
          expiryDate: "2025-04-30 03:30 PM",
          status: "Expired",
        },
        {
          srNo: 3,
          trxId: "TRX123456",

          userName: "Priya Desai",
          email: "priya.desai@example.com",
          planTitle: "Basic Plan",
          price: "299",
          duration: "7 days",
          purchaseDate: "2025-04-25 09:00 AM",
          expiryDate: "2025-05-02 09:00 AM",
          status: "Active",
        },
        {
          srNo: 4,
          trxId: "TRX123456",

          userName: "Aman Verma",
          email: "aman.verma@example.com",
          planTitle: "Premium Plan",
          price: "999",
          duration: "30 days",
          purchaseDate: "2025-03-20 06:45 PM",
          expiryDate: "2025-04-20 06:45 PM",
          status: "Expired",
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
    return (
      arrayData &&
      arrayData.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        "Trx Id": value?.trxId,
        "User Name": value?.userName,
        Email: value?.email,
        "Plan Title": value?.planTitle,
        Price: `$${value?.price}`,
        Duration: value?.durationLabel,
        "Purchase Date": value?.purchaseDate,
        "Expiry Date": value?.expiryDate,
        Status: value?.status,
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>setIsModalOpen(true),
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
          heading="Transaction Management"
          
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
          } Plan`}
          description={`Are you sure, you want to ${
            modalOpen === "delete"
              ? "Delete"
              : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
          } this plan?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription={"Are you sure, you want to block this plan?"}
          showBlock={true}
        />
      )}
       <TransactionDetailModal
            open={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            transactionDetail={{
              userName: "Anjali Sharma",
              email: "anjali.sharma@example.com",
              planTitle: "Premium Plan",
              price: "$ 999",
              duration: "30 days",
              purchaseDate: "2025-04-01 10:15 AM",
              expiryDate: "2025-05-01 10:15 AM",
              status: "Active",
            }}
          />
    </Box>
  );
}
