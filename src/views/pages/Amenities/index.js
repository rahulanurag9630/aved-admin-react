import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box, Button } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import useDebounce from "src/component/customHook/Debounce";
import { formatDate } from "src/utils";

const tableHead = [
  { heading: "Sr No.", column: 0, isMobile: true },
  { heading: "Title", column: 1, isMobile: true },
  { heading: "Image", column: 2, isMobile: true },
  { heading: "Created Date & Time", column: 3, isMobile: true },
  { heading: "Action", column: 4, isMobile: true },
];

export default function Amenities() {
  const history = useHistory();
  const location = useLocation();
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState("");
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [status, setStatus] = useState("ACTIVE");

  const [selectFilter, setSelectFilter] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "All",
  });
  const deb = useDebounce(selectFilter?.search, 1000);

  const [noOfPages, setNoOfPages] = useState({ pages: 1, totalPages: 1 });

  let filterData = {
    page,
    limit: rowsPerPage,
    fromDate: selectFilter.fromDate?.toISOString(),
    toDate: selectFilter.toDate?.toISOString(),
    search: deb?.trim() || undefined,
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
  };

  // 🔹 Fetch amenities
  const handleGetAmenities = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listAmenities",
        source,
        paramsData: filterData,
      });

      if (response.data.responseCode === 200) {
        const sorted = [...response.data.result.docs].sort((a, b) => a.order - b.order);
        setTransactionList(sorted);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setTransactionList([]);
      }
    } catch (err) {
      console.error(err);
      setTransactionList([]);
    } finally {
      setIsClear(false);
      setIsLoading(false);
    }
  };

  // 🔹 Move item up/down
  const moveItem = (index, direction) => {
    const newList = [...transactionList];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= transactionList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setTransactionList(newList);
  };

  // 🔹 Save order
  const handleSaveOrder = async () => {
    try {
      const orderedAmenities = transactionList.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      await apiRouterCall({
        method: "POST",
        endPoint: "updateAmenityOrder",
        bodyData: { orderedAmenities, page, limit: rowsPerPage },
        token: localStorage.getItem("token"),
      });

      toast.success("Order saved successfully.");
      handleGetAmenities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order.");
    }
  };

  // 🔹 Block/Delete API
  const handleBlockDeleteApi = async () => {
    try {
      setIsUpdating(true);

      let bodyData = {};
      if (modalOpen === "delete") {
        bodyData = { id: deleteBlockId?._id };
      } else {
        bodyData = { id: deleteBlockId?._id, status };
      }

      const response = await apiRouterCall({
        method: "PATCH",
        endPoint: modalOpen === "delete" ? "deleteAmenity" : "toggleAmenityStatus",
        bodyData,
        token: localStorage.getItem("token"),
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setModalOpen("");
        handleGetAmenities();
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Table data
  const tableDataFunction = (arrayData) =>
    arrayData?.map((value, i) => ({
      "Sr No.": (page - 1) * rowsPerPage + i + 1,
      Title: value?.title,
      Image: <img src={value?.image} alt="img" height="50px" style={{ borderRadius: "10px" }} />,
      "Created Date & Time": formatDate(value?.createdAt),
      Action: [
        {
          icon: ArrowUpwardIcon,
          onClick: () => moveItem(i, -1),
          style: { color: "blue" },
        },
        {
          icon: ArrowDownwardIcon,
          onClick: () => moveItem(i, 1),
          style: { color: "blue" },
        },
        {
          icon: FaEdit,
          onClick: () =>
            history.push({ pathname: "/add-amenities-management", state: { ...value, editAmenities: true } }),
        },
        {
          icon: BlockIcon,
          onClick: () => {
            setStatus(value?.status === "ACTIVE" ? "BLOCK" : "ACTIVE");
            setDeleteBlockId(value);
            setModalOpen("block");
          },
          style: { color: value?.status === "BLOCK" ? "red" : "green" },
        },
        {
          icon: DeleteIcon,
          onClick: () => {
            setDeleteBlockId(value);
            setModalOpen("delete");
          },
        },
      ],
    }));

  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({ fromDate: null, toDate: null, search: "", status: "All" });
      setPage(1);
      setIsClear(true);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) handleGetAmenities(source);
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetAmenities(source);
    return () => source.cancel();
  }, [page, deb, selectFilter.fromDate, selectFilter.toDate, selectFilter.status, rowsPerPage]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading heading="Amenities Management" pathname="/add-amenities-management" addButton="Add Amenities" />
      </Box>

      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => (page > 1 ? setPage(1) : handleGetAmenities())}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="Amenities"
          apiEndPoint="getUserList"
          placeholder="Search by title"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>

      {/* 🔹 Save Order button */}
      <Button variant="contained" color="primary" onClick={handleSaveOrder} style={{ marginBottom: 16 }}>
        Save Order
      </Button>

      <TableComp
        isMobileAdaptive
        tableHead={tableHead}
        scoreListData={tableDataFunction(transactionList)}
        noOfPages={noOfPages}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        NoDataFoundText="default"
        isLoading={isLoading}
      />

      {modalOpen && deleteBlockId && (
        <ConfirmationDialogBox
          openModal={["delete", "block"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={`${modalOpen === "delete" ? "Delete" : deleteBlockId.status !== "BLOCK" ? "Block" : "Unblock"} Amenity`}
          description={`Are you sure, you want to ${modalOpen === "delete" ? "Delete" : deleteBlockId.status !== "BLOCK" ? "Block" : "Unblock"} this amenity?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription="Are you sure, you want to block this amenity?"
          showBlock
        />
      )}
    </Box>
  );
}
