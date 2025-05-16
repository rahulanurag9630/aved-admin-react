import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { RxCross2 } from "react-icons/rx";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  mainModalBox: {
    "& .MuiDialog-paper": {
      backgroundColor: "#222222",
    },
    position: "relative",
    "& img": {
      width: "100px",
      padding: "20px 0px",
    },
    "& h4": {
      fontFamily: "'Sora', sans-serif",
      maxWidth: "300px",
      "& span": {
        fontWeight: "200",
      },
    },
    "& p": {
      color: "#9b9b9b",
      padding: "10px 0px",
    },
  },
  IconBox: {
    position: "absolute",
    right: "0",
  },
  mainContainerModal: {
    padding: "20px 0px 40px",
  },
}));
export default function SuccessfullModal({ setOpenModal, openModal }) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      maxWidth="xs"
      fullWidth
      className={classes.mainModalBox}
    >
      <Box>
        <Box className={classes.IconBox}>
          <IconButton onClick={() => setOpenModal(false)}>
            <RxCross2 />
          </IconButton>
        </Box>
        <DialogContent>
          <Box className={classes.mainContainerModal} align="center">
            <Box>
              <img src="images/success.png" alt="" />
            </Box>
            <Box>
              <Typography variant="h4">
                <span>Password Changed</span> Successfully!
              </Typography>
              <Typography variant="body1">
                Your password s been changed successfully.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              className="transparentbutton"
              onClick={()=>history.push("/")}
            >
              Done
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
