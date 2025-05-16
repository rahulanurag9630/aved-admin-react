import { AuthContext } from "src/context/Auth";
import { sortAddress } from "src/utils";
import {
  Box,
  Typography,
  makeStyles,
  Divider,
  Button,
  TextField,
  FormControl,
} from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  topheadBox: {
    "& .displaySpacebetween": {
      [theme.breakpoints.down("xs")]: {
        // display: "block",
        flexWrap: "wrap",
        gap: "10px",
      },
    },
    "& .roundfiled": {
      [theme.breakpoints.down("xs")]: {
        marginTop: "8px",
      },
    },
  },
}));

export default function Topheading({
  heading,
  addButton,
  pathname,
  isConnected,
}) {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const history = useHistory();

  return (
    <Box className={classes.topheadBox}>
      <Box className="displaySpacebetween">
        <Box>
          <Typography variant="h3">{heading}</Typography>
        </Box>

        {pathname && (
          <Button
            variant="contained"
            color="primary"
            // className="transparentbutton"
            onClick={() => history.push(pathname)}
          >
            {addButton || "Add New Sub Admin"}
          </Button>
        )}
        {isConnected && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => auth.walletConnect()}
              disabled={auth.account}
            >
              {auth.account ? sortAddress(auth.account) : "Connect Wallet"}
            </Button>
          </Box>
        )}
      </Box>
      <Box mt={2} mb={2}>
        <Divider />
      </Box>
    </Box>
  );
}
