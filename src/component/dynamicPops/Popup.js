import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ButtonCircularProgress from "../ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    margin: 0,
    padding: 0,
    fontSize: "30px",
    borderBottom: "1px solid #11D9EF4a",
    position: "relative !important",
    padding: "10px !important",
  },
  dialogContent: {
    padding: "0px !important",
  },
  closeIconButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  arrowIconButton: {
    marginRight: theme.spacing(1),
  },
  displayCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogActions: {
    justifyContent: "center",
    padding: 0,
    "& button": {
      height: (props) => (props.isMobile ? "30px" : "40px"),
      fontSize: (props) =>
        props.isMobile
          ? theme.typography.pxToRem(10)
          : theme.typography.fontSize,
    },
  },
}));

export default function Popup({
  maxWidth,
  open,
  handleClose,
  title,
  children,
  actions = [],
  titleIcon,
  isLoading,
  isRemove,
  params,
  isClose,
  type,
  isShowIcon,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles({ isMobile });

  return (
    <Dialog
      onClose={() => {
        if (isClose) {
          handleClose();
        }
      }}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth
      keepMounted
      {...params}
      style={{ padding: "15px" }}
    >
      <DialogTitle id="customized-dialog-title" className={classes.dialogTitle}>
        {!isShowIcon && (
          <IconButton
            onClick={handleClose}
            size="small"
            disabled={isLoading}
            className={classes.closeIconButton}
          >
            <CloseIcon />
          </IconButton>
        )}
        {titleIcon && (
          <Box className={classes.arrowIconButton}>{titleIcon}</Box>
        )}

        <Typography variant="h5" color="primary">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        {children}
      </DialogContent>
      {actions.length > 0 && (
        <DialogActions className={classes.dialogActions}>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              disabled={action.isLoading || isLoading}
              color={action.color}
              variant={action.variant}
              style={{ display: action.isRemove ? "none" : "flex" }}
              type={type}
            >
              {action.label}
              {action.isLoading && <ButtonCircularProgress />}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
}
