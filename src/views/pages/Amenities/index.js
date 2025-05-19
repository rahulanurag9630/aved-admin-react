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
    column: 1,
    isMobile: true,
  },
  {
    heading: "Image",
    column: 2,
    isMobile: true,
  },
 
  {
    heading: "Created Date & Time",
    column: 3,
    isMobile: true,
  },
  {
    heading: "Action",
    column: 4,
    isMobile: true,
  },
];

  

export default function Blogs() {
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
    title: "Swimming Pool",
    image: "https://via.placeholder.com/100x100?text=Pool",
    description: "Olympic-sized pool open from 6 AM to 10 PM.",
    createdAt: "2025-05-01 10:15 AM",
  },
  {
    id: 2,
    title: "Gym",
    image: "https://via.placeholder.com/100x100?text=Gym",
    description: "24/7 fully equipped gym with trainers.",
    createdAt: "2025-05-01 10:30 AM",
  },
  {
    id: 3,
    title: "Community Hall",
    image: "https://via.placeholder.com/100x100?text=Hall",
    description: "Available for resident events and parties.",
    createdAt: "2025-05-01 11:00 AM",
  },
  {
    id: 4,
    title: "Children's Play Area",
    image: "https://via.placeholder.com/100x100?text=Play+Area",
    description: "Safe play area with modern equipment.",
    createdAt: "2025-05-01 11:15 AM",
  },
  {
    id: 5,
    title: "Library",
    image: "https://via.placeholder.com/100x100?text=Library",
    description: "Quiet reading space with a wide range of books.",
    createdAt: "2025-05-01 12:00 PM",
  },
  {
    id: 6,
    title: "Jogging Track",
    image: "https://via.placeholder.com/100x100?text=Jogging",
    description: "1.5 km paved track around the garden.",
    createdAt: "2025-05-01 12:30 PM",
  },
  {
    id: 7,
    title: "Guest Parking",
    image: "https://via.placeholder.com/100x100?text=Parking",
    description: "Dedicated parking slots for visitors.",
    createdAt: "2025-05-01 01:00 PM",
  },
  {
    id: 8,
    title: "Clubhouse",
    image: "https://via.placeholder.com/100x100?text=Clubhouse",
    description: "Multipurpose indoor recreational space.",
    createdAt: "2025-05-01 01:30 PM",
  },
  {
    id: 9,
    title: "Security Room",
    image: "https://via.placeholder.com/100x100?text=Security",
    description: "Round-the-clock monitoring and control room.",
    createdAt: "2025-05-01 02:00 PM",
  },
  {
    id: 10,
    title: "CCTV Surveillance",
    image: "https://via.placeholder.com/100x100?text=CCTV",
    description: "24/7 camera monitoring across premises.",
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
          heading="Amenities Management"
          pathname={checkEdit ? "/add-amenities-management" : undefined}
          addButton={"Add Amenities"}
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
