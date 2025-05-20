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
        heading: "Image",
        column: 0,
        isMobile: true,
    },
    {
        heading: "Title",
        column: 0,
        isMobile: true,
    },
    {
        heading: "Views",
        column: 0,
        isMobile: true,
        isCopy: true,
    },


];




export default function MostViewedProperty() {
    const history = useHistory();
    const location = useLocation();

    const [modalOpen, setModalOpen] = useState("");
    const [deleteBlockId, setDeleteBlockId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [transactionList, setBlogList] = useState([]);
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
            setBlogList([
                {
                    id: 1,
                    title: "Luxury Villa",
                    description: "A beginner's guide to building apps using React.js.",
                    image: "/images/property.jpg",
                    views: 100,
                },
                {
                    id: 2,
                    title: "Downtown Apartment	",
                    description: "An in-depth look into closures and lexical scoping in JS.",
                    image: "/images/property.jpg",
                    createdAt: "2025-05-01 11:00 AM",
                    views: 200
                },
                {
                    id: 3,
                    title: "Luxury Villa",
                    description: "Enhance your UI with these effective CSS tricks.",
                    image: "/images/property.jpg",
                    createdAt: "2025-05-01 12:00 PM",
                    views: 3424
                },
                {
                    id: 4,
                    title: "Downtown Apartment	",
                    description: "Explore different ways to manage state in large apps.",
                    image: "/images/property.jpg",
                    createdAt: "2025-05-01 01:00 PM",
                    views: 1231
                },

            ]);

        } catch (err) {
            setBlogList([]);
            setIsLoading(false);
            console.log(err);
        }
        finally {
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
                Image: (<img src={`${value?.image}`} height={"50px"} style={{ borderRadius: "10px" }} />),
                Title: value?.title,

                Views: value?.views,


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
                    heading={`${modalOpen === "delete"
                        ? "Delete"
                        : deleteBlockId.status !== "BLOCK"
                            ? "Block"
                            : "Unblock"
                        } Plan`}
                    description={`Are you sure, you want to ${modalOpen === "delete"
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
