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
import { formatDate } from "../../../utils/index";

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

  // let filterData = {
  //   page: page,
  //   limit: 10,
  //   fromDate: selectFilter.fromDate
  //     ? selectFilter.fromDate.toISOString()
  //     : undefined,
  //   toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
  //   search: selectFilter.search !== "" ? selectFilter.search : undefined,
  //   status: selectFilter.status !== "All" ? selectFilter.status : undefined,
  // };

  const filterData = {
    page: page,
    limit: 10,
    fromDate: selectFilter.fromDate
      ? selectFilter.fromDate.toISOString()
      : undefined,
    toDate: selectFilter.toDate ? selectFilter.toDate.toISOString() : undefined,
    search: deb && deb.trim() !== "" ? deb.trim() : undefined,
    status: selectFilter.status !== "All" ? selectFilter.status : undefined,
  };


  function getTextSnippetFromHTML(html, limit = 65) {
    if (!html) return "";

    // Create a temporary DOM element to extract plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    // Trim and limit to `limit` characters
    return plainText.length > limit
      ? plainText.substring(0, limit).trim() + "..."
      : plainText.trim();
  }

  const handleGetTransaction = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listBlogs",
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
    } catch (err) {
      setTransactionList([]);
      console.log(err);
    } finally {
      setIsClear(false);
      setIsLoading(false);
    }
  };


  const handleBlockDeleteApi = async (reason) => {
    console.log("blocking")
    try {
      setIsUpdating(true);

      const isDelete = modalOpen === "delete";
      const endPoint = isDelete ? "deleteBlog" : "toggleBlockStatus";
      const method = "POST";

      const response = await apiRouterCall({
        method,
        endPoint,
        bodyData: {
          id: deleteBlockId?._id,
          reason: reason || undefined,
        },
        headers: {
          authToken: localStorage.getItem("authToken"), // ✅ Add this line to send authToken
        },
      });

      console.log("API Response:", response);

      if (response?.data?.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setModalOpen("");
        handleGetTransaction();
        if (isDelete && page > 1 && transactionList.length === 1) {
          setPage((prevPage) => {
            const newPage = prevPage - 1;
            setTimeout(() => handleGetTransaction(), 0);
            return newPage;
          });
        } else {
          await handleGetTransaction();
        }
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

  function tableDataFunction(arrayData, condition) {
    return (
      arrayData &&
      arrayData.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Title: value?.title,
        Description: getTextSnippetFromHTML(value?.description),
        Price: `$${value?.price}`,
        Duration: value?.durationLabel,
        Badge: value?.badge,

        "Created Date & Time": formatDate(value?.createdAt),
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/add-blog-management",
                state: { ...value, isView: true },
              }),
          },
          ...(checkEdit
            ? [
              {
                icon: FaEdit,
                onClick: () =>
                  history.push({
                    pathname: "/add-blog-management",
                    state: { ...value, isEdit: true },
                  }),
              },
              {
                icon: BlockIcon,
                onClick: () => {
                  setDeleteBlockId(value);
                  setModalOpen("block");
                },
                style: { color: value.status === "ACTIVE" ? "green" : "red" }
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
          heading="Blog Management"
          pathname={checkEdit ? "/add-blog-management" : undefined}
          addButton={"Add Blog"}
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
      {modalOpen && deleteBlockId && (
        <ConfirmationDialogBox
          openModal={["delete", "block"].includes(modalOpen)}
          handleClose={() => setModalOpen("")}
          heading={`${modalOpen === "delete"
            ? "Delete"
            : deleteBlockId?.status === "BLOCK"
              ? "Unblock"
              : "Block"
            } Blog`}
          description={`Are you sure you want to ${modalOpen === "delete"
            ? "delete"
            : deleteBlockId?.status === "BLOCK"
              ? "unblock"
              : "block"
            } this blog?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
          blockDescription={"Are you sure, you want to block this blog?"}
          showBlock={modalOpen === "block"}
        />
      )}

    </Box>
  );
}