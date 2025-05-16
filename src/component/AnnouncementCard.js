import React from "react";
import { Box, Typography, makeStyles, Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  announcementBox: {
    "& .announceBox": {
      cursor: "pointer",
      background:
        "linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
      // backdropFilter: "blur(21px)",
      borderRadius: "5px",
      // height: "100%",
      marginBottom: "10px",
      border: "1px solid #26384ea8",
      position: "relative",
      zIndex: "9",
      "&::before": {
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        content: "''",
        zIndex: "-1",
        position: "absolute",
        backdropFilter: "blur(21px)",
      },
    },

    "& .productinnerBox": {
      padding: "10px",
      "& .MuiAvatar-root": {
        width: "100%",
        height: "200px",
        borderRadius: "10px",
        background: "#0b0b0b",
      },
    },
    "&:hover": {
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
    },
    "& figure": {
      margin: "0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      width: "initial",
    },
    "& h5": { margin: "10px 0px" },
  },
}));

const AnnouncementCard = (props) => {
  const { data } = props;
  const history = useHistory();
  const classes = useStyles();

  return (
    <Box className={classes.announcementBox}>
      <Box
        className="announceBox"
        onClick={() => history.push("/announcement-detail")}
      >
        <Box className="productinnerBox">
          <Avatar src="images/car.png" alt={data?.title} />
          <Box className="displaySpacebetween">
            <Typography variant="h5">Car Event</Typography>
            <Typography variant="body1">10/10/2024 10:30pm</Typography>
          </Box>

          <Typography variant="body2">
            Lorem ipsum dolor sit amet consectetur. Pulvinar velit amet velit
            cursus lobortis aenean ultricies leo in.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AnnouncementCard;
