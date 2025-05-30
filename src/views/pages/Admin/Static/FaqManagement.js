import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const tableHead = [
  {
    heading: "Sr No.",
  },
  {
    heading: "Question",
  },
  {
    heading: "Answer",
  },
  {
    heading: "Action",
  },
];

export default function FaqManagement() {
  let filterData;
  const history = useHistory();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBlockId, setDeleteBlockId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const checkEdit = location?.state?.isEdit;
  const [transactionList, setTransactionList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const handleGetTransaction = async (source) => {
    try {
      filterData = {
        page: page,
        limit: Number.MAX_SAFE_INTEGER,
        contentType: "faq"
      };
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "faqList",
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
      setIsLoading(false);
    } catch (err) {
      setTransactionList([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleBlockDeleteApi = async () => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "DELETE",
        endPoint: "deleteStaticContent",
        bodyData: {
          id: deleteBlockId ? deleteBlockId?._id : undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setModalOpen(false);
        handleGetTransaction();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  function tableDataFunction(arrayData) {
    return (
      arrayData &&
      arrayData?.map((value, i) => ({
        "Sr No.": (page - 1) * 10 + i + 1,
        Question:
          value?.question?.length <= 20
            ? value?.question
            : `${value?.question.slice(0, 20)}...`,
        Answer: (
          <Box className="mainContent">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  value?.answer?.length <= 20
                    ? value?.answer
                    : `${value?.answer.slice(0, 20)}...`,
              }}
            />
          </Box>
        ),
        Action: [
          {
            icon: VisibilityIcon,
            onClick: () =>
              history.push({
                pathname: "/static-content",
                state: {
                  ...value,
                  isView: true,
                  title: value?.question,
                  description: value?.answer,
                },
              }),
          },
          ...(checkEdit
            ? [
              {
                icon: FaEdit,
                onClick: () =>
                  history.push({
                    pathname: "/static-content",
                    state: {
                      ...value,
                      editFaq: true,
                      title: value?.question,
                      description: value?.answer,
                    },
                  }),
              },
              {
                icon: DeleteIcon,
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    handleGetTransaction(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  return (
    <Box>
      <Box className="tophead">
        <Topheading
          heading="FAQ management"
          pathname={
            checkEdit
              ? {
                pathname: "/static-content",
                state: { addFaq: true },
              }
              : undefined
          }
          addButton="Add FAQ"
        />
      </Box>
      <Box my={3}></Box>
      <TableComp
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
          openModal={modalOpen}
          handleClose={() => setModalOpen(false)}
          heading="Delete"
          description={`Are you sure, you want to delete this FAQ?`}
          HandleConfirm={handleBlockDeleteApi}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
