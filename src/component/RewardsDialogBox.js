import {
  Box,
  Container,
  Dialog,
  Divider,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import { formatNumber } from "src/utils";

const useStyles = makeStyles((theme) => ({
  rewardDetailsTypo: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "36px",
  },
  rewardWinner: {
    fontSize: "23px",
    fontWeight: 700,
    marginBottom: "8px",
    backgroundImage:
      "linear-gradient(to right, rgba(255, 176, 0, 1), rgba(255, 86, 77, 1), rgba(255, 0, 152, 1), rgba(93, 0, 193, 1))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  rewardGbp: {
    fontSize: "16px",
    fontWeight: 700,
  },
  rewardDes: {
    fontSize: "14px",
    fontWeight: 300,
    color: "#FFFFFF99",
  },
}));

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: "5px",
    color: theme.palette.grey[500],
    padding: "0px",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: "28px 0px 28px",
    background: "#26252E",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
}))(MuiDialogContent);

export default function RewardsDialogBox({
  openModal,
  setOpenModal,
  propsData,
}) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          style: {
            width: "440px",
            height: "380px",
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle onClick={() => setOpenModal(false)}>
          <Typography
            className={classes.rewardDetailsTypo}
            variant="h6"
            style={{ position: "absolute", left: "20px", top: "12px" }}
          >
            REWARD DETAILS
          </Typography>
          <IconButton className="closeButton">
            <CloseIcon fontSize="large" style={{ cursor: "pointer" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <>
            <Box>
              <img src="images/giftBox.png" alt="giftBox" />
            </Box>
            <Typography variant="h6" className={classes.rewardWinner}>
              REWARD FOR WINNER
            </Typography>
            <Container maxWidth="sm">
              {propsData?.raceTrack[
                propsData?.tabs === "ended"
                  ? "currentPricePool"
                  : "expectedPricePool"
              ]?.map((item, i) => {
                return (
                  <Box className="displayCenter" key={i} style={{ gap: "5px" }}>
                    <Typography variant="h4" style={{ paddingLeft: "0px" }}>
                      #{item?.rank || "1"}
                    </Typography>
                    <Box className="displayCenter">
                      <img
                        src="/images/fieroLogo.png"
                        alt="logo"
                        width="20px"
                        style={{ pointerEvents: "none", userSelect: "none" }}
                      />
                      <Typography variant="h4">
                        {(item?.price && formatNumber(item?.price, 3)) || "0"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Container>
            <Box mb={1} mt={2}>
              <Typography className={classes.rewardDes}>
                (Only verified players are eligible for rewards)
              </Typography>
            </Box>
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
}
