import React from "react";
import {
  Box,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import TopTradingSkeleton from "src/component/Skeletons/TopTradingSkeleton";
import NoDataFound from "./NoDataFound";
import { noDataFoundResponses } from "src/ApiConfig/messageResponse";
import CustomTable from "./TableComp/CustomTable";
import { useTheme, useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    background: "rgba(255, 255, 255, 0.02)",
    "& .MuiIconButton-root": {
      color: "#0000008f",
      padding: "0px",
      marginRight: "15px",
    },
  },
  rowOdd: {
    background: "rgba(255, 255, 255, 0.04)",
  },
  rowEven: {
    background: "rgb(23 25 42)",
  },
}));
function TableComp({
  isMobileAdaptive,
  tableHead,
  scoreListData,
  noOfPages,
  page,
  setPage,
  isLoading,
  classTable,
  NoDataFoundText,
  popupTitle = "",
}) {
  const classes = useStyles();
  const tableClass = classTable ? classTable : classes;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
<<<<<<< HEAD
      {isMobileAdaptive && isMobile ? (
        <CustomTable
          tableHead={tableHead}
          scoreListData={scoreListData}
          popupTitle={popupTitle}
        />
      ) : (
        <TableContainer className={tableClass.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHead?.map((head, index) => (
                  <TableCell key={index}>{head.heading}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreListData?.map((dataOrIndex, i) => (
                <TableRow key={i}>
                  {tableHead?.map((head, index) => {
                    return (
                      <TableCell key={index}>
                        <Box className="displayCenter">
                          {["Action", "Reward Breakdown", "Details"].includes(
                            head.heading
                          )
                            ? dataOrIndex[head.heading]?.map((action, idx) => {
                                const Icon = action?.icon;
                                return (
                                  <Tooltip
                                    title={action?.title || ""}
                                    key={idx}
                                  >
                                    <IconButton
                                      size="small"
                                      key={idx}
                                      onClick={action?.onClick}
                                      disabled={!action?.icon}
                                    >
                                      <Icon style={action?.style}/>
                                    </IconButton>
                                  </Tooltip>
                                );
                              })
                            : dataOrIndex[head.heading] ?? "..."}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
=======

      <TableContainer className={tableClass.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHead?.map((head, index) => (
                <TableCell key={index}>{head.heading}</TableCell>
>>>>>>> b5ff9bd557c4ca20009d57abc5a6e177dd2f2553
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {scoreListData?.map((dataOrIndex, i) => (
              <TableRow key={i}>
                {tableHead?.map((head, index) => {
                  return (
                    <TableCell key={index}>
                      <Box className="displayCenter">
                        {["Action", "Reward Breakdown", "Details"].includes(
                          head.heading
                        )
                          ? dataOrIndex[head.heading]?.map((action, idx) => {
                            const Icon = action?.icon;
                            return (
                              <Tooltip
                                title={action?.title || ""}
                                key={idx}
                              >
                                <IconButton
                                  size="small"
                                  key={idx}
                                  onClick={action?.onClick}
                                  disabled={!action?.icon}
                                >
                                  <Icon style={action?.style} />
                                </IconButton>
                              </Tooltip>
                            );
                          })
                          : dataOrIndex[head.heading] ?? "..."}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {isLoading &&
              Array.from({ length: 10 }).map((itm) => (
                <TopTradingSkeleton skeleton={tableHead} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && scoreListData && scoreListData?.length === 0 && (
        <NoDataFound text={noDataFoundResponses[NoDataFoundText]} />
      )}
      {!isLoading && scoreListData?.length > 0 && noOfPages?.pages > 1 && (
        <Box my={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={noOfPages?.pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}

export default TableComp;
