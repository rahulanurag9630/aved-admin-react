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
import { formatDate } from "../../../utils";

const tableHead = [
  { heading: "Sr No.", column: 0, isMobile: true },
  { heading: "Property Name", column: 0, isMobile: true },
  { heading: "Property Type", column: 0, isMobile: true, isCopy: true },
  { heading: "Overview", column: 0, isMobile: true },
  { heading: "No Of Floar", column: 0, isMobile: true },
  { heading: "No Of BedRooms", column: 1, isMobile: true },
  { heading: "Created Date & Time", column: 1, isMobile: true },
  { heading: "Action", column: 1, isMobile: true },
];

export default function Property() {
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
  const checkEdit = location?.state?.isEdit;

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
    page,
    limit: rowsPerPage,
    fromDate: selectFilter.fromDate?.toISOString(),
    toDate: selectFilter.toDate?.toISOString(),
    search: deb?.trim() || undefined,
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
  };

  // 🔹 Fetch properties
  const handleGetTransaction = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listProperties",
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
      setTransactionList([]);
      console.error(err);
    } finally {
      setIsClear(false);
      setIsLoading(false);
    }
  };

  // 🔹 Reorder functions
  const moveItem = (index, direction) => {
    const newList = [...transactionList];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= transactionList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setTransactionList(newList);
  };

  const handleSaveOrder = async () => {
    try {
      const orderedProperties = transactionList.map((p, index) => ({
        id: p._id,
        order: index,
      }));

      await apiRouterCall({
        method: "POST",
        endPoint: "updatePropertyOrder",
        bodyData: {
          orderedProperties, page: page,
          limit: rowsPerPage,
        },
        token: localStorage.getItem("authToken"),
      });

      toast.success("Order saved successfully.");
      handleGetTransaction();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order.");
    }
  };

  // 🔹 Block/Delete API
  const handleBlockDeleteApi = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: modalOpen === "delete" ? "DELETE" : "PUT",
        endPoint: modalOpen === "delete" ? "deleteProperty" : "toggleBlockProperty",
        bodyData: { propertyId: deleteBlockId?._id },
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setModalOpen("");
        handleGetTransaction();
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Table data formatter
  function tableDataFunction(arrayData) {
    return (
      arrayData &&
      arrayData.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        "Property Name": value?.property_name?.length > 60
          ? value.property_name.slice(0, 60) + "..."
          : value.property_name,
        "Property Type": value?.property_type,
        Overview: value?.overview?.length > 60
          ? value.overview.slice(0, 60) + "..."
          : value.overview,
        "No Of Floar": value?.no_of_floors,
        "No Of BedRooms": value?.no_of_bedrooms,
        "Created Date & Time": formatDate(value?.createdAt),
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/add-property-management",
                state: { ...value, view: true },
              }),
          },
          ...(true
            ? [
              {
                icon: FaEdit,
                onClick: () =>
                  history.push({
                    pathname: "/add-property-management",
                    state: { ...value, edit: true },
                  }),
              },
              {
                icon: BlockIcon,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("block");
                },
                style: { color: value.status === "ACTIVE" ? "green" : "red" },
              },
              {
                icon: DeleteIcon,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("delete");
                },
              },
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
            ]
            : []),
        ],
      }))
    );
  }

  // 🔹 Clear Filter
  const handleClearFilter = () => {
    if (!isClear) {
      setSelectFilter({ fromDate: null, toDate: null, search: "", status: "All" });
      setPage(1);
      setIsClear(true);
    }
  };

  // 🔹 Effects
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) handleGetTransaction(source);
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetTransaction(source);
    return () => source.cancel();
  }, [page, deb, selectFilter.fromDate, selectFilter.toDate, selectFilter.status, rowsPerPage]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading
          heading="Property Management"
          pathname={"/add-property-management"}
          addButton="Add Property"
        />
      </Box>

      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => (page > 1 ? setPage(1) : handleGetTransaction())}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="Properties"
          apiEndPoint="getUserList"
          placeholder="Search by property name"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>

      {/* 🔹 Save Order button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveOrder}
        style={{ marginBottom: 16 }}
      >
        Save Order
      </Button>

      <TableComp
        isMobileAdaptive={true}
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
          heading={`${modalOpen === "delete"
            ? "Delete"
            : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
            } Property`}
          description={`Are you sure, you want to ${modalOpen === "delete"
            ? "Delete"
            : deleteBlockId.status !== "BLOCK"
              ? "Block"
              : "Unblock"
            } this property?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription="Are you sure, you want to block this property?"
          showBlock={true}
        />
      )}
    </Box>
  );
}
