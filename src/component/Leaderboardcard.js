import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  dazeCardsBox: {
    position: "relative",
    zIndex: "1",
    "& .liveBox": {
      background: "#C20000",
      borderRadius: "8px",
      padding: "5px 15px",
    },
    "& .imgBox": {
      padding: "35px 0px",
      "& img": {
        maxWidth: "100%",
        width: "auto",
      },
    },
  },
}));

export default function Leaderboardcard({ i }) {
  const classes = useStyles();
  return (
    <Box key={"di" + i.toString()} className={classes.dazeCardsBox}>
      <Box className="dazeBox">
        <Box style={{ position: "relative", zIndex: "999" }}>
          <Box className="centerCircle"></Box>
          <Box align="center" mt={1}>
            <Typography variant="h5">Skate board #6598</Typography>
          </Box>
          <Box className="imgBox">
            <img src="images/daze.png" alt="" />
          </Box>
          <Box className="displaySpacebetween">
            <Typography variant="h6">1st Place</Typography>

            <Box className="displayCenter">
              <img src="images/coin.png" alt="" />
              <Box ml={1}>
                <Typography variant="body2">1.5 Fiero</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
