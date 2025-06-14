import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import { useHistory, useLocation } from "react-router-dom";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import TableComp from "src/component/TableComp";

import { formatDate } from "../../../../utils/index";

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
        heading: "Date Added",
        column: 0,
        isMobile: true,
        isCopy: true,
    },


];




export default function RecentalyAddedProperty({ data }) {
    const location = useLocation();
    const [page, setPage] = useState(1);
    const checkEdit = location?.state?.isEdit;
    console.log("checkEdit", checkEdit);
    function tableDataFunction(arrayData, condition) {
        return (
            arrayData &&
            arrayData.map((value, i) => ({
                Image: (<img src={`${value?.images[0]}`} height={"50px"} style={{ borderRadius: "10px" }} />),
                Title: value?.property_name,

                "Date Added": formatDate(value?.createdAt),


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
