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
      heading: "Description",
      column: 0,
      isMobile: true,
      isCopy: true,
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
      heading: "Badge",
      column: 1,
      isMobile: true,
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
          title: "Basic Plan",
          description: "Access to limited features for casual users.",
          price: "4.99",
          durationLabel: "1 Month",
          durationValue: 1,
          image: "https://via.placeholder.com/100x100?text=Basic",
          badge: "Starter",
          createdAt: "2025-05-01 10:15 AM",
        },
        {
          id: 2,
          title: "Pro Plan",
          description: "All features unlocked with ad-free experience.",
          price: "9.99",
          durationLabel: "1 Month",
          durationValue: 1,
          image: "https://via.placeholder.com/100x100?text=Pro",
          badge: "Popular",
          createdAt: "2025-05-01 10:30 AM",
        },
        {
          id: 3,
          title: "Gold Plan",
          description: "Priority access to premium content and support.",
          price: "24.99",
          durationLabel: "3 Months",
          durationValue: 3,
          image: "https://via.placeholder.com/100x100?text=Gold",
          badge: "Best Value",
          createdAt: "2025-05-01 11:00 AM",
        },
        {
          id: 4,
          title: "Silver Plan",
          description: "Ad-free experience with daily spark boosts.",
          price: "19.99",
          durationLabel: "3 Months",
          durationValue: 3,
          image: "https://via.placeholder.com/100x100?text=Silver",
          badge: "Standard",
          createdAt: "2025-05-01 11:15 AM",
        },
        {
          id: 5,
          title: "Premium 6M",
          description: "6-month plan with all core features enabled.",
          price: "44.99",
          durationLabel: "6 Months",
          durationValue: 6,
          image: "https://via.placeholder.com/100x100?text=Premium",
          badge: "Long-Term",
          createdAt: "2025-05-01 12:00 PM",
        },
        {
          id: 6,
          title: "Ultimate Plan",
          description: "Everything in Gold + conversation starters.",
          price: "59.99",
          durationLabel: "6 Months",
          durationValue: 6,
          image: "https://via.placeholder.com/100x100?text=Ultimate",
          badge: "Exclusive",
          createdAt: "2025-05-01 12:30 PM",
        },
        {
          id: 7,
          title: "Monthly Saver",
          description: "Basic plan with limited-time discount.",
          price: "3.99",
          durationLabel: "1 Month",
          durationValue: 1,
          image: "https://via.placeholder.com/100x100?text=Saver",
          badge: "Discount",
          createdAt: "2025-05-01 01:00 PM",
        },
        {
          id: 8,
          title: "Elite Access",
          description: "Access to premium features with extra perks.",
          price: "69.99",
          durationLabel: "1 Year",
          durationValue: 12,
          image: "https://via.placeholder.com/100x100?text=Elite",
          badge: "Top Tier",
          createdAt: "2025-05-01 01:30 PM",
        },
        {
          id: 9,
          title: "Student Plan",
          description: "Affordable plan for verified students only.",
          price: "2.99",
          durationLabel: "1 Month",
          durationValue: 1,
          image: "https://via.placeholder.com/100x100?text=Student",
          badge: "Student",
          createdAt: "2025-05-01 02:00 PM",
        },
        {
          id: 10,
          title: "Family Pack",
          description: "One subscription shared across 3 accounts.",
          price: "29.99",
          durationLabel: "3 Months",
          durationValue: 3,
          image: "https://via.placeholder.com/100x100?text=Family",
          badge: "Group",
          createdAt: "2025-05-01 02:30 PM",
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
        Title: value?.title,
        Desctiption: value?.description,
        Price: `$${value?.price}`,
        Duration: value?.durationLabel,
        Badge: value?.badge,
        
        "Created Date & Time": value?.createdAt,
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/add-subscription",
                state: { ...value, viewSubAdmin: true },
              }),
          },
          ...(checkEdit
            ? [
                {
                  icon: FaEdit,
                  onClick: () =>
                    history.push({
                      pathname: "/add-subscription",
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
          heading="Subscription Management"
          pathname={checkEdit ? "/add-subscription" : undefined}
          addButton={"Add Plan"}
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
    </Box>
  );
}
