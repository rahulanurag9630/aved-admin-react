import React from "react";
import { makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .imageBox": {
      border: "1px solid #FF564D",
      padding: "25px",
      alignItems: "center",
      borderRadius: "8px",
      flexDirection: "column",
      justifyContent: "center",
      "&:hover": {
        boxShadow:
          "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
        border: "none",
      },

      "& figure": {
        margin: "20px 0px",
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      },

      "& img": {
        maxHeight: "97px",
        width: "auto",
        maxWidth: "100%",
      },
    },
  },
}));

function LogoCard(props) {
  const classes = useStyles();
  const { data } = props;
  return (
    <>
      <Box className={classes.root}>
        <Box className="imageBox">
          <figure style={{ margin: "20px 0px" }}>
            <img src={data?.image} />
          </figure>
        </Box>
      </Box>
    </>
  );
}

export default LogoCard;
