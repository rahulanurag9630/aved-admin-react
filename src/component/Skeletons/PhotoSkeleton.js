import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  PostBox: {
    backgroundColor: "theme",
    position: "relative",

    "& .MuiCardHeader-root": {
      padding: "0 0 16px 0",
    },
    "& .MuiCardContent-root": {
      padding: "16px 16px 16px 0",
    },
  },
  postImg: {
    height: 327,
    borderRadius: "8px !important",
  },
  postImg1: {
    height: 130,
  },
}));
function PhotoSkeleton({ type }) {
  const classes = useStyles();
  return (
    <Box className={classes.PostBox}>
      <Skeleton
        animation="wave"
        variant="rect"
        className={type === "horseCard" ? classes.postImg1 : classes.postImg}
        style={
          type === "phototab"
            ? { height: "129px" }
            : type === "horseCard"
            ? { height: "130px", borderRadius: "10px" }
            : { borderRadius: "20px", height: "270px" }
        }
      />
    </Box>
  );
}
export default React.memo(PhotoSkeleton);
