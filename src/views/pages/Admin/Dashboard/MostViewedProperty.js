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




export default function MostViewedProperty({ data }) {
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








    function tableDataFunction(arrayData, condition) {
        return (
            arrayData &&
            arrayData.map((value, i) => ({
                Image: (<img src={`${value?.images[0]}`} height={"50px"} style={{ borderRadius: "10px" }} />),
                Title: value?.property_name,

                Views: value?.views,


            }))
        );
    }






    return (
        <Box>

            <TableComp
                isMobileAdaptive={true}
                tableHead={tableHead}
                scoreListData={tableDataFunction(data)}
                page={page}
                setPage={setPage}
                NoDataFoundText="default"
            />

        </Box>
    );
}
