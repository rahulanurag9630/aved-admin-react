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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  rowsSelect: {
    minWidth: 80,
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
  rowsPerPage,
  setRowsPerPage,
}) {
  const classes = useStyles();
  const tableClass = classTable ? classTable : classes;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRowsChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // reset to first page on rows change
  };

  return (
    <Box>
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
                                  style={action?.style}
                                >
                                  <Icon />
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
              Array.from({ length: rowsPerPage || 10 }).map((_, idx) => (
                <TopTradingSkeleton key={idx} skeleton={tableHead} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && scoreListData && scoreListData?.length === 0 && (
        <NoDataFound text={noDataFoundResponses[NoDataFoundText]} />
      )}

      {!isLoading && scoreListData?.length > 0 && noOfPages?.pages > 1 && (
        <Box className={classes.paginationContainer}>
          {/* Rows per page selector */}
          <FormControl className={classes.rowsSelect} size="small">
            <InputLabel id="rows-per-page-label">Rows</InputLabel>
            <Select
              labelId="rows-per-page-label"
              style={{ background: "white", padding: "3px" }}
              value={rowsPerPage}
              onChange={handleRowsChange}
            >
              {[5, 10, 25, 50, 100].map((rows) => (
                <MenuItem key={rows} value={rows}>
                  {rows}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Pagination */}
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
