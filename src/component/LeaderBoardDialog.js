import {
  Box,
  Dialog,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  rewardDetailsTypo: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "36px",
  },
  rewardWinner: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  winnerBox: {
    background: "rgba(255, 255, 255, 0.05)",
    marginBottom: "4px",
    padding: "7px 15px",
    "& .firstColor": {
      backgroundImage:
        "linear-gradient(to right, rgba(255, 176, 0, 1), rgba(255, 86, 77, 1), rgba(255, 0, 152, 1), rgba(93, 0, 193, 1))",
    },
    "& .otherColor": {
      backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
    },
    "& .secColor": {
      color: "rgba(255, 190, 21, 1)",
    },
    "& .thirdColor": {
      color: "rgba(255, 100, 13, 1)",
    },
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    height: "45px",
    background: "rgba(31, 30, 39, 1)",
    padding: "0px",
  },
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
    padding: "10px 30px 30px",
    background: "#26252E",
  },
}))(MuiDialogContent);

const arraydata = [
  { no: "1" },
  { no: "2" },
  { no: "3" },
  { no: "4" },
  { no: "5" },
  { no: "6" },
  { no: "7" },
  { no: "8" },
  { no: "9" },
  { no: "10" },
];

export default function LeaderBoardDialog({ openModal, setOpenModal }) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        maxWidth="md"
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          style: {
            borderRadius: "5px",
            width: "545px",
          },
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClick={() => setOpenModal(false)}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 12px 8px 27px",
            }}
          >
            <Typography className={classes.rewardDetailsTypo} variant="h6">
              LEADERBOARD
            </Typography>
            <CloseIcon fontSize="large" style={{ cursor: "pointer" }} />
          </Box>
        </DialogTitle>
        <Divider style={{ height: "2px" }} />
        <DialogContent>
          {arraydata?.map((itm, i) => {
            return (
              <Grid container className={classes.winnerBox} key={i}>
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    className={
                      i === 0
                        ? `${classes.rewardWinner} firstColor`
                        : i === 1
                        ? "secColor"
                        : i === 2
                        ? "thirdColor"
                        : `${classes.rewardWinner} otherColor`
                    }
                  >
                    {itm?.no} ST
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <img
                    src="/images/leaderBoardWinner.svg"
                    alt="leaderBoardWinner"
                  />
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}
