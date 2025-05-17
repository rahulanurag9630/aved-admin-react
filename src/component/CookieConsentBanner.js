import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  IconBox: {
    position: "absolute",
    right: "0",
  },
  cancelBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    "&::hover": {
      background: "transparent",
    },
    "& svg": {
      color: "#fff",
      fontWeight: "700",
      fontSize: "35px",
      background: "transparent",
    },
  },
  dialougTitle: {
    "& .subTextWallet": {
      color: "#FFFFFF99",
      maxWidth: "100%",
      marginTop: "20px",
      lineHeight: "24px",
    },
  },
}));

const CookieConsentBanner = ({ showDialog, handleDialogClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      className={classes.dailogOpen}
      keepMounted
      open={showDialog}
      onClose={handleDialogClose}
    >
      <DialogContent style={{ paddingBottom: "0px" }}>
        <Box className={classes.dialougTitle} align="center">
          <Typography className="ubuntu" variant="h4" color="primary">
            Welcome To Cookies Info
          </Typography>
          <Typography
            variant="body1"
            className="subTextWallet"
            color="primary"
            style={{ fontFamily: "'Sora', sans-serif", color: "" }}
          >
            We are here to help you comply with GDPR and other international
            Cookie Laws.
          </Typography>
          <Typography
            variant="body1"
            className="subTextWallet"
            color="primary"
            style={{
              fontFamily: "'Sora', sans-serif",
              marginTop: "10px",
            }}
          >
            Please accept cookies for the best website experience. By clicking
            'Accept and continue', you agree to the use of all cookies as
            described in our Cookie Statement. You can change or withdraw your
            cookie consent at any time.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        style={{
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Box mt={2} mb={2} maxWidth="400px">
          <Button
            className="transparentbutton"
            // style={{ padding: "8px 25px", minWidth: "133px" }}
            variant="contained"
            color="secondary"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="secondary"
            // style={{ padding: "8px 25px", minWidth: "133px" }}
            onClick={handleDialogClose}
          >
            Accept & Continue
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CookieConsentBanner;
