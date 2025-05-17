import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper } from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from "@material-ui/lab/Skeleton";
const useStyles = makeStyles((theme) => ({
  PostBox: {
    "& .MuiCardHeader-root": {
      padding: "0 0 16px 0",
    },
  },
  earnCard: {
    padding: "5px 24px",
    borderRadius: "0px",
    boxShadow: "none",
  },
}));

export default function LoadHistory() {
  const classes = useStyles();
  return (
    <Box className={classes.PostBox}>
      <CardHeader
        title={
          <Skeleton
            animation="wave"
            height={30}
            width="95%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={20} width="60%" />}
      />
    </Box>
  );
}
