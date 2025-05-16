import React from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #FF564D",
    borderRadius: "8px",
    padding: "25px",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",

    "&:hover": {
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
      border: "none",
    },

    "& h3": {
      color: "#FF564D",
      fontSize: "35px",
      fontWeight: "700",
    },
    "& h4": {
      fontSize: "16px",
      fontWeight: "700",
      padding: "20px 0px 0px",
    },
  },
}));

function RewardsCard(props) {
  const classes = useStyles();
  const { data } = props;
  return (
    <>
      <Box className={classes.root} align="center">
        <Box mb={2}>
          <Typography variant="h3">
            {data?.number}
            <sub
              style={{
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "2px",
              }}
            >
              {" "}
              {data?.buttomtext}
            </sub>
          </Typography>
        </Box>
        <Typography variant="h4">{data?.count}</Typography>
      </Box>
    </>
  );
}

export default RewardsCard;
