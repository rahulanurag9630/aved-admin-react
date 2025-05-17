import {
  Box,
  Button,
  Typography,
  makeStyles,
  Dialog,
  Avatar,
} from "@material-ui/core";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  notificationBox: {
    position: "relative",
    zIndex: "999",
    "& .notBox": {
      background: "#1c191c",
      padding: "15px 20px",
      borderRadius: "5px",
    },
  },
}));
const dataa = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor lacu justo commodo",
    date: "10/10/2024",
    time: "10:30pm",
  },
];

export default function Notification() {
  const classes = useStyles();
  const [openClear, setOpenClear] = useState(false);
  return (
    <Box className={classes.notificationBox}>
      <Box className="displaySpacebetween displayBlock">
        <Typography variant="h3" color="primary">
          Notifications
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenClear(true)}
        >
          Clear All
        </Button>
      </Box>
      <Box mt={3}>
        {dataa.map((value) => (
          <Box className="notBox" my={1}>
            <Box className="displayStart">
              <Avatar src="images/profileimage.png" />
              <Box ml={2}>
                <Typography variant="body2" color="primary">
                  {value.text}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#ff00cd", fontSize: "12px" }}
                >
                  {value.date}&nbsp;&nbsp;{value.time}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog
        open={openClear}
        onClose={() => setOpenClear(false)}
        fullWidth
        maxWidth="xs"
      >
        <Box className="newModalBorder">
          <Box className="mainbox1">
            <Box align="center">
              <Box my={1}>
                <Typography variant="h5" color="primary">
                  Clear notification
                </Typography>
              </Box>
              <Typography variant="body2" color="primary">
                Are you sure want to clear all notification?
              </Typography>
              <Box className="displayCenter" mt={4} mb={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  className="transparentbutton "
                >
                  Yes
                </Button>
                <Box ml={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenClear(false)}
                    className="outlined"
                  >
                    No
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
