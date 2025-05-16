import React, { useState, useEffect } from "react";
import { Box, makeStyles, Typography, Grid } from "@material-ui/core";
import Topheading from "src/component/TopHeading";
import { apiRouterCall } from "src/ApiConfig/service";

const useStyles = makeStyles((theme) => ({
  viewcontentBox: {
    padding: "20px",
    background: "rgba(255, 255, 255, 0.025)",
    "& .mainContent": {
      "& figure": {
        marginLeft: "0",
      },
      "& a": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& td": {
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& span, section": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },

      "& iframe": {
        width: "100%",
        // overflow: "hidden",
        display: "inherit",
      },
      "& img": {
        maxWidth: "100%",
        height: "auto",
      },

      "& >*": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        wordBreak: "break-word",
        overflow: "auto",
        color: `${theme.palette.text.primary} !important`,
      },
      "& h4": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& h5": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& h1": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& h2": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& h3": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& span": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& em": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
      },
      "& p": {
        wordWrap: "break-word",
        backgroundColor: "unset !important",
        color: `${theme.palette.text.primary} !important`,
        fontSize: "14px !important",
      },
      "& strong": {
        color: `${theme.palette.text.primary} !important`,
      },
    },
  },
}));

export default function ViewStatic() {
  const classes = useStyles();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    let idd = window.location.search.split("?")[1];
    if (idd) getHandleStatic(idd);
  }, [window.location.search]);
  const getHandleStatic = async (values) => {
    try {
      const response = await apiRouterCall({
        endPoint: `staticContent`,
        id: { type: values },
      });
      if (response?.data?.responseCode === 200) {
        setDescription(response.data.result.description);
        setTitle(response.data.result.title);
      } else {
        setDescription("");
        setTitle("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box className={classes.viewcontentBox}>
      <Topheading heading="View Static Content" />

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Box mt={2} mb={2}>
            <Typography variant="h4">{title}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Box className="mainContent">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
