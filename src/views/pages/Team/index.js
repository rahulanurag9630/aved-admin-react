import React, { useEffect, useState } from "react";
import MainFilter from "src/component/MainFilter";
import { Box, IconButton, Button, Stack } from "@material-ui/core";
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
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import useDebounce from "src/component/customHook/Debounce";
import { formatDate } from "../../../utils/index";

const tableHead = [
  { heading: "Sr No.", column: 0, isMobile: true },
  { heading: "Name", column: 0, isMobile: true },
  { heading: "Position", column: 0, isMobile: true, isCopy: true },
  { heading: "Created Date & Time", column: 1, isMobile: true },
  { heading: "Action", column: 1, isMobile: true },
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
  const [selectFilter, setSelectFilter] = useState({ fromDate: null, toDate: null, search: "", status: "All" });
  const deb = useDebounce(selectFilter?.search, 1000);
  const [noOfPages, setNoOfPages] = useState({ pages: 1, totalPages: 1 });

  const filterData = {
    page,
    limit: 10,
    fromDate: selectFilter.fromDate?.toISOString(),
    toDate: selectFilter.toDate?.toISOString(),
    search: deb?.trim() || undefined,
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
  };

  const handleGetTransaction = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listTeam",
        source,
        paramsData: filterData,
      });
      if (response.data.responseCode === 200) {
        const sorted = [...response.data.result.docs].sort((a, b) => a.order - b.order);
        setTransactionList(sorted);
        setNoOfPages({ pages: response.data.result.pages, totalPages: response.data.result.total });
      } else {
        setTransactionList([]);
      }
    } catch (err) {
      console.log(err);
      setTransactionList([]);
    } finally {
      setIsClear(false);
      setIsLoading(false);
    }
  };

  const moveItem = (index, direction) => {
    const newList = [...transactionList];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= transactionList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setTransactionList(newList);
  };

  const handleSaveOrder = async () => {
    try {
      const orderedTeam = transactionList.map((member, index) => ({ id: member._id, order: index }));
      await apiRouterCall({
        method: "POST",
        endPoint: "updateTeamOrder",
        bodyData: { orderedTeam },
        token: localStorage.getItem("authToken"),
      });
      toast.success("Order saved successfully.");
      handleGetTransaction();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save order.");
    }
  };

  const handleBlockDeleteApi = async (reason) => {
    try {
      setIsUpdating(true);
      const isDelete = modalOpen === "delete";
      const endPoint = isDelete ? "deleteTeam" : "toggleBlockTeamStatus";
      const method = "POST";
      const response = await apiRouterCall({
        method,
        endPoint,
        bodyData: { id: deleteBlockId?._id, reason: reason || undefined },
        headers: { authToken: localStorage.getItem("authToken") },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setModalOpen("");
        handleGetTransaction();
      } else {
        toast.error(response?.data?.responseMessage || "Something went wrong.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const tableDataFunction = (arrayData) =>
    arrayData?.map((value, i) => ({
      "Sr No.": (page - 1) * 10 + i + 1,
      Name: value?.name,
      Position: value?.position,
      "Created Date & Time": formatDate(value?.createdAt),
      Action: [
        { icon: VisibilityIcon, onClick: () => history.push({ pathname: "/add-team-management", state: { ...value, isView: true } }) },
        ...(checkEdit
          ? [
            { icon: FaEdit, onClick: () => history.push({ pathname: "/add-team-management", state: { ...value, isEdit: true } }) },
            { icon: BlockIcon, onClick: () => { setDeleteBlockId(value); setModalOpen("block"); }, style: { color: value.status === "ACTIVE" ? "green" : "red" } },
            { icon: DeleteIcon, onClick: () => { setDeleteBlockId(value); setModalOpen("delete"); } },
            { icon: ArrowUpwardIcon, onClick: () => moveItem(i, -1), style: { color: "blue" } },
            { icon: ArrowDownwardIcon, onClick: () => moveItem(i, 1), style: { color: "blue" } },
          ]
          : []),
      ],
    }));

  const handleClearFilter = () => {
    setSelectFilter({ fromDate: null, toDate: null, search: "", status: "All" });
    setPage(1);
    setIsClear(true);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (isClear) handleGetTransaction(source);
    return () => source.cancel();
  }, [isClear]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetTransaction(source);
    return () => source.cancel();
  }, [page, deb, selectFilter.fromDate, selectFilter.toDate, selectFilter.status]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading heading="Team Management" pathname={checkEdit ? "/add-team-management" : undefined} addButton="Add Team" />
      </Box>
      <Box my={3}>
        <MainFilter
          setSelectFilter={setSelectFilter}
          selectFilter={selectFilter}
          handleCallApi={() => (page > 1 ? setPage(1) : handleGetTransaction())}
          filterData={{ ...filterData, limit: noOfPages.totalPages }}
          transactionList={transactionList}
          excelTableName="SubAdminManagement"
          apiEndPoint="getUserList"
          placeholder="Search by name"
          tableDataFunction={tableDataFunction}
          handleClearApi={handleClearFilter}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleSaveOrder} style={{ marginBottom: 16 }}>
        Save Order
      </Button>
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
      {modalOpen && deleteBlockId && (
        <ConfirmationDialogBox
          openModal={["delete", "block"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={`${modalOpen === "delete" ? "Delete" : deleteBlockId?.status === "BLOCK" ? "Unblock" : "Block"} Blog`}
          description={`Are you sure you want to ${modalOpen === "delete" ? "delete" : deleteBlockId?.status === "BLOCK" ? "unblock" : "block"} this blog?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription="Are you sure, you want to block this blog?"
          showBlock={modalOpen === "block"}
        />
      )}
    </Box>
  );
}
