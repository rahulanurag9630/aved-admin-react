import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import "react-image-lightbox/style.css";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    "& .imageBox": {
      "& img": {
        width: "100%",
        maxWidth: "100%",
        borderRadius: "10px",
        cursor: "pointer",
        zIndex: "-1 !important",
        filter: "blur(10px)",
      },
    },
  },
}));

function GalleryCard(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <>
      <Box className={classes.root}>
        <Box className="imageBox">
          <img
            src={data?.image}
            alt=""
            style={{ pointerEvents: "none", userSelect: "none" }}
          />
        </Box>
      </Box>
    </>
  );
}

export default GalleryCard;
