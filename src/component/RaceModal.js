import {
  Box,
  Button,
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
import { capitalizeFirstLetter } from "src/utils";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  rewardDetailsTypo: {
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "31px",
    maxWidth: "300px",
  },
  rewardWinner: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  winnerBox: {
    background: "rgba(255, 255, 255, 0.05)",
    marginBottom: "3px",
    padding: "5px 15px",
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
    "& .MuiButton-containedSecondary": {
      borderRadius: "5px",
      padding: "10px 20px",
    },
    "& .MuiTypography-colorSecondary": {
      margin: "14px 0",
    },
  },
}))(MuiDialogContent);

export default function RaceModal({ openModal, setOpenModal, propsData }) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <div>
      <Dialog
        maxWidth="xs"
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle onClick={() => setOpenModal(false)}>
          <IconButton className="closeButton">
            <CloseIcon fontSize="medium" style={{ cursor: "pointer" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box align="center">
            <Typography className={classes.rewardDetailsTypo}>
              {capitalizeFirstLetter(propsData?.subTabs)} & Character is
              required to play this game.
            </Typography>
            <Typography
              color="secondary"
              variant="body2"
              style={{ fontWeight: "300" }}
            >
              Buy a {propsData?.subTabs.toLowerCase()} from mint and start
              racing!
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => history.push("/mint")}
              >
                GET ASSETS
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
