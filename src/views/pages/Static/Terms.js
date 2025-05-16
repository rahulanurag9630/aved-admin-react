import { apiRouterCall } from "src/ApiConfig/service";
import { Box, Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "30px 0",
    [theme.breakpoints.down("xs")]: {
      padding: "35px 0",
    },
    "& p": {
      color: "#686868",
      marginBottom: "10px",
    },
    "& h5": {
      marginBottom: "10px",
      marginTop: "20px",
    },
    "& li": {
      color: "#686868",
      marginBottom: "10px",
      fontSize: "14px",
    },
  },
  heading: {
    textAlign: "start",
    "& h1": {
      // color: "#000",
    },
  },
  details: {
    "& h4": {
      fontSize: "15px",
      lineHeight: "25px",
    },
    "& .description": {
      "& figure, & a, & td, & span, & section, & iframe, & img, & >*, & strong, & h4, & h5, & h1, & h2, & h3, & em, & p":
        {
          backgroundColor: "unset !important",
          color: `${theme.palette.text.primary} !important`,
          wordBreak: "break-word",
          overflow: "auto",
        },
      "& p": {
        fontSize: "14px !important",
      },
      "& figure": {
        marginLeft: "0",
      },

      "& img": {
        width: "100%",
        height: "auto",
      },
      "& >*": {
        backgroundColor: "unset !important",
        wordBreak: "break-word",
        overflow: "auto",
        color: `${theme.palette.text.primary} !important`,
      },
    },
  },
}));
const Terms = () => {
  const classes = useStyles();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [updatedAt, setupdatedAt] = useState(new Date());

  const getHandleStatic = async (values) => {
    try {
      const response = await apiRouterCall({
        endPoint: `staticContent`,
        id: { type: values },
      });
      if (response?.data?.responseCode === 200) {
        setDescription(response.data.result.description);
        setTitle(response.data.result.title);
        setupdatedAt(response.data.result.updatedAt);
      } else {
        setDescription("");
        setTitle("");
        setupdatedAt(new Date());
      }
    } catch (err) {
      console.log(" err ", err);
    }
  };

  useEffect(() => {
    let idd = window.location.search.split("?")[1];
    if (idd) getHandleStatic(idd);
  }, [window.location.search]);
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Paper elevation={2}>
          <Box className={classes.heading}>
            <Typography variant="h2" color="primary">
              {title}
            </Typography>
          </Box>
          <Box className={classes.details} mt={2}>
            <Typography variant="body2">
              Last updated: {moment(updatedAt).format("ll")}
            </Typography>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Terms;
