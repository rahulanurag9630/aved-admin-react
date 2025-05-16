import React from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  standardCard: {
    border: "1px solid #FF564D",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 0px 53px rgb(0 0 0 / 25%)",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    // transition: "0.3s",
    "&:hover": {
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
      border: "none",
    },
    "& h3": {
      color: "#FF574C",
      fontSize: "35px !important",
      fontWeight: "700",
    },
    "& h4": {
      fontSize: "16px",
      fontWeight: "700",
      marginTop: "12px",
    },
    "& p": {
      color: "#ffffffe3",
      fontWeight: "200",
      fontSize: "15px",
      lineHeight: "26px",
    },
  },
}));

function StandingCard(props) {
  const classes = useStyles();
  const { data } = props;
  return (
    <>
      <Box className={classes.standardCard} align="center">
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
        <Box>
          <figure style={{ margin: "20px 0px" }}>
            <img
              src={data?.image}
              style={{ maxWidth: "100%", width: "auto" }}
              alt=""
            />
          </figure>
        </Box>
        <Typography variant="body2">{data?.address}</Typography>
        <Typography
          variant="body2"
          style={{ color: "rgb(171, 166, 166)", fontSize: "13px" }}
        >
          {" "}
          {data?.name}{" "}
        </Typography>
        <Typography variant="h4">{data?.count}</Typography>
      </Box>
    </>
  );
}

export default StandingCard;
