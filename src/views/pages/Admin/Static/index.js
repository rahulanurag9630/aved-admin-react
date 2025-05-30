import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  TableRow,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  IconButton,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FiEdit } from "react-icons/fi";
import Topheading from "src/component/TopHeading";
import { useHistory, useLocation } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import axios from "axios";
import TopTradingSkeleton from "src/component/Skeletons/TopTradingSkeleton";

const useStyles = makeStyles((theme) => ({
  statictableBox: {
    "& .MuiIconButton-root": {
      // backgroundColor: "rgba(255, 255, 255, 0.025)",
      padding: "3px",
      color: "#0000008f",
      padding: "0px",
      marginRight: "15px",
      "& svg": {
        color: "#0000008f",
        // fontSize: "18px",
      },
    },
  },
  tableContainer: {
    "& .MuiTableContainer-root": {
      marginTop: "20px",
    },
  },
}));

export default function Static() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const checkEdit = location?.state?.isEdit;
  const [isLoading, setIsLoading] = useState(true);
  const [staticContentData, setStaticContentData] = useState([]);

  const getUserManagementApi = async (source) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listStaticContent",
        source: source,
      });
      if (response.data.responseCode === 200) {
        setStaticContentData(response.data.result);
      } else {
        setStaticContentData([]);
      }
      setIsLoading(false);
    } catch (err) {
      setStaticContentData([]);
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getUserManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <Box className={classes.tableContainer}>
      <Box className="tophead">
        <Topheading heading="Static Content Management" />
      </Box>

      <TableContainer>
        <Table className={classes.statictableBox}>
          <TableHead>
            <TableRow alignItems="center">
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              staticContentData?.filter((value) => value?.contentType !== "faq")?.map((value, i) => (
                <TableRow>
                  <TableCell> {i + 1}</TableCell>
                  <TableCell>{value?.title}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center">
                      <IconButton
                        onClick={() =>
                          history.push({
                            pathname: "/static-content",
                            state: { ...value, isView: true },
                          })
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {checkEdit ? (
                        <>
                          &nbsp; &nbsp; &nbsp;
                          <IconButton
                            onClick={() =>
                              history.push({
                                pathname: "/static-content",
                                state: { ...value, isEdit: true },
                              })
                            }
                          >
                            <FiEdit />
                          </IconButton>
                        </>
                      ) : (
                        []
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading &&
              Array.from({ length: 5 }).map((itm) => (
                <TopTradingSkeleton skeleton={[1, 1, 1]} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
