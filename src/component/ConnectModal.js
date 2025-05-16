import React from "react";
import {
  makeStyles,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Hidden,
  DialogTitle,
} from "@material-ui/core";
import { IoClose } from "react-icons/io5";

const useStyles = makeStyles((theme) => ({
  connectModalBox: {
    "& .leftWalletImg": {
      width: "auto",
      maxWidth: "356px",
    },
    "& h4": {
      color: "#fff",
      fontWeight: "300",
      [theme.breakpoints.down("xs")]: {
        fontSize: "12px",
      },
    },
    "& h6": {
      color: "rgba(255, 255, 255, 0.6)",
      fontWeight: "300",
      marginTop: "12px",
    },
    "& p": {
      // color: "red",
    },
    "& .subTextWallet": {
      color: "#FFFFFF99",
      maxWidth: "201px",
      marginTop: "24px",
    },
  },
  walletBox: {
    gap: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #857E7E",
    borderRadius: "10px",
    padding: "10px",
    marginTop: "28px",
    maxWidth: "247px",
    cursor: "pointer",
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
}));

function ConnectModal({ openModal, handleCloseModal, auth }) {
  const classes = useStyles();
  // const [checkout, setCheckout] = React.useState(false);
  // const handleOpenCheckOut = () => {
  //   setCheckout(true);
  //   handleCloseModal();
  // };

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
        style={{ borderRadius: "20px" }}
      >
        <DialogTitle className="dislogTitleBox">
          {" "}
          <IconButton className="closeButton" onClick={handleCloseModal}>
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent className="borderShadowBox1">
          <Box className={classes.connectModalBox} align="center">
            <Box className="gridFlex">
              <Box>
                <Typography className="ubuntu" variant="h4">
                  Connect your Wallet
                </Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" className="subTextWallet">
                  Choose your wallet, that you want to connect.
                </Typography>
              </Box>
              <Box
                className={classes.walletBox}
                onClick={() => !auth.metaMaskLoading && auth.walletConnect()}
              >
                {auth.metaMaskLoading ? (
                  <img
                    src="images/metmask.gif"
                    style={{ maxWidth: "35px" }}
                    alt="metamask"
                  />
                ) : (
                  <>
                    <img width="35px" alt="" src="images/MetaMaskImg.png" />
                    <Typography
                      variant="body2"
                      style={{
                        color: "#fff",
                        textTransform: "uppercase",
                        fontSize: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Metamask
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/* <CheckOutModal
        setCheckout={setCheckout}
        checkout={checkout}
        setOpen={handleCloseModal}
      /> */}
    </>
  );
}

export default ConnectModal;
