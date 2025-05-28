import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { RxCross2 } from "react-icons/rx";
import ButtonCircularProgress from "./ButtonCircularProgress";

const useStyles = makeStyles(() => ({
  IconBox: {
    position: "absolute",
    right: "0",
  },
  cancelBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    "&:hover": {
      background: "transparent",
    },
    "& svg": {
      color: "#fff",
      fontWeight: "700",
      background: "transparent",
    },
  },
  dialougTitle: {
    "& .subTextWallet": {
      maxWidth: "100%",
      marginTop: "5px",
    },
  },
}));

export default function ConfirmationDialogBox({
  openModal,
  handleClose,
  heading,
  description,
  HandleConfirm,
  isLoading,
  type,
  blockDescription,
  showBlock
}) {
  const classes = useStyles();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const validateReason = () => {
    let errorMessage = "";
    if (!reason) {
      errorMessage = "Reason is required.";
    } else if (reason.length > 600) {
      errorMessage = "Reason cannot exceed 600 characters.";
    }
    setError(errorMessage);
    return !errorMessage;
  };

  const handleConfirmReply = () => {
    if (validateReason()) {
      HandleConfirm(reason);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={openModal}
        keepMounted
        onClose={() => !isLoading && handleClose()}
      >
        <DialogTitle style={{ background: "#746058" }}>
          <IconButton
            disabled={isLoading}
            onClick={() => handleClose()}
            className="closeButton"
          >
            <RxCross2 color="#fff" />
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ paddingBottom: "0px" }}>
          <Box className={classes.dialougTitle} align="center">
            <Typography
              variant="h6"
              color="primary"
              style={{ fontWeight: "500", marginBottom: "12px" }}
            >
              {heading}
            </Typography>
            {blockDescription && showBlock ? (
              <Typography
                variant="body2"
                color="primary"
                className="subTextWallet"
              >
                {blockDescription}
              </Typography>
            ) : heading.includes("Block") ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  multiline
                  className="textField"
                  style={{ color: "#000" }}
                  rows={5}
                  placeholder="Type message..."
                  inputProps={{
                    maxLength: 600,
                  }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onBlur={() => validateReason()}
                  disabled={isLoading}
                />
                <Box className="displaySpacebetween">
                  <FormHelperText error>{error && error}</FormHelperText>
                  <Box className="displaySpacebetween">
                    <Typography
                      variant="body2"
                      color="secondary"
                      textAlign="end"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {reason.length}/600
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Typography
                variant="body2"
                color="primary"
                className="subTextWallet"
              >
                {description}
              </Typography>
            )}
          </Box>
        </DialogContent>
        {type !== "ended" && (
          <DialogActions
            style={{
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Box mt={2} mb={2} maxWidth="400px">
              <Button
                style={{ minWidth: "133px" }}
                variant="contained"
                color="secondary"
                disabled={isLoading}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              {HandleConfirm && (
                <>
                  &nbsp;&nbsp;
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ minWidth: "133px" }}
                    onClick={() =>{
                      console.log("kdkdk")
                      HandleConfirm()
                      heading.includes("Block")
                        ? handleConfirmReply()
                        : HandleConfirm()
                    }
                    }
                    disabled={isLoading}
                  >
                    Confirm {isLoading && <ButtonCircularProgress />}
                  </Button>
                </>
              )}
            </Box>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
