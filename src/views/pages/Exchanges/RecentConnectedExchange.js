import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  makeStyles,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
} from "@material-ui/core";
import {
  IoMdEye,
  IoMdEyeOff,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { ExchangeLogo, capitalizeFirstLetter } from "src/utils";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";
import { Check } from "@material-ui/icons";
import { AuthContext } from "src/context/Auth";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import NoDataFound from "src/component/NoDataFound";
import DynamicTooltip from "src/component/DynamicTooltip";
import { apiRouterCall } from "src/ApiConfig/service";

const useStyles = makeStyles((theme) => ({
  customBox: {
    background: "#FFFFFF0A",
    borderRadius: "6px",
  },
  avtClass: {
    display: "flex",
    alignItems: "center",
  },
  txtColor: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'HelveticaNowDisplay', sans-serif",
  },
  btnManagement: {
    padding: "10px 16px",
    borderRadius: "9px",
  },
  displaySpacebetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  displayCenterStart: {
    display: "flex",
    alignItems: "center",
  },
  displayAlign: {
    display: "flex",
    alignItems: "center",
  },
}));

const RecentConnectedExchange = ({ setEditExchangeData, editExchangeData }) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [exchangeData, setExchangeData] = useState();
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async (id) => {
    setIsLoading(true);
    try {
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: "disconnectExchanges",
        bodyData: {
          _id: id,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        auth.getConnectedExchangeList();
        setDisconnectModal(false);
        setExchangeData();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Box className={classes.customBox}>
      <Paper elevation={2}>
        <Typography variant="h5" color="primary">
          Recent
        </Typography>

        {auth?.connectedExchangeList &&
          auth?.connectedExchangeList.map((data, index) => (
            <Box
              style={{
                borderBottom:
                  index === auth?.connectedExchangeList.length - 1
                    ? "none"
                    : "1px solid #EAECF0",
              }}
              key={index}
              mt={2}
            >
              <Box className={classes.displaySpacebetween}>
                <Box
                  className={`${classes.avtClass} ${classes.displayCenterStart}`}
                >
                  <img
                    alt="logo"
                    src={
                      ExchangeLogo.find(
                        (d) =>
                          d.title.toLowerCase() ===
                          data?.exchangeName.toLowerCase()
                      )?.img
                    }
                    style={{
                      height: "25px",
                      width: "25px",
                      borderRadius: "50%",
                    }}
                  />
                  &nbsp;&nbsp;
                  <Typography variant="subtitle" color="primary">
                    {capitalizeFirstLetter(data?.exchangeName)}
                  </Typography>
                </Box>
              </Box>
              <Box mt={1.5}>
                <Grid container spacing={1} alignItems="center" pb={2}>
                  <Grid item lg={6}>
                    <Box
                      className={classes.displayAlign}
                      style={{
                        border: "1px dashed rgba(255, 255, 255, 0.1)",
                        width: "fit-content",
                        paddingLeft: "12px",
                      }}
                    >
                      <Typography variant="body2" color="primary">
                        API Key :
                      </Typography>
                      &nbsp;&nbsp;
                      <CopyBox address={data?.apiKey} />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    style={{
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      className="displayCenter"
                      style={{ alignItems: "start" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (!editExchangeData) {
                            setConfirmationModal(true);
                            setEditExchangeData(data);
                          } else {
                            setEditExchangeData();
                          }
                        }}
                      >
                        {editExchangeData ? "Cancel" : "Edit"}
                      </Button>
                      <DynamicTooltip content="Edit Exchange Keys.">
                        <IconButton
                          style={{
                            background: "transparent",
                            padding: "0px",
                          }}
                        >
                          <IoMdInformationCircleOutline />
                        </IconButton>
                      </DynamicTooltip>
                    </Box>
                    <Box
                      className="displayCenter"
                      style={{ alignItems: "start" }}
                    >
                      <Button
                        variant="contained"
                        color={
                          data?.status !== "BLOCK" ? "secondary" : "primary"
                        }
                        className="btnManagement"
                        onClick={() => {
                          setExchangeData(data);
                          setDisconnectModal(true);
                        }}
                      >
                        {data?.status === "BLOCK" ? "Connect" : "Disconnect"}
                      </Button>
                      <DynamicTooltip
                        content={`${
                          data?.status === "BLOCK"
                            ? "After entering all the required exchange keys, click the Connect button. This will securely save your keys and complete the connection process."
                            : "Click the Disconnect button to safely terminate the connection. This will ensure your keys are no longer linked."
                        }`}
                      >
                        <IconButton
                          style={{
                            background: "transparent",
                            padding: "0px",
                          }}
                        >
                          <IoMdInformationCircleOutline />
                        </IconButton>
                      </DynamicTooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}

        {auth?.connectedExchangeList?.length === 0 && (
          <NoDataFound text="No Exchange Found!" />
        )}
      </Paper>
      {disconnectModal && (
        <ConfirmationDialogBox
          openModal={disconnectModal}
          handleClose={() => setDisconnectModal(false)}
          heading={`${
            exchangeData?.status === "BLOCK" ? "Connect" : "Disconnect"
          } Exchange`}
          description={`Are you sure you want to ${
            exchangeData?.status === "BLOCK" ? "connect" : "disconnect"
          } this exchange?`}
          HandleConfirm={() => handleDisconnect(exchangeData?._id)}
          isLoading={isLoading}
        />
      )}
      {confirmationModal && (
        <ConfirmationDialogBox
          openModal={confirmationModal}
          handleClose={() => {
            setConfirmationModal(false);
            setEditExchangeData();
          }}
          heading="Edit Exchange"
          description="Modifying or editing saved exchange keys may result in the cancellation of ongoing trades. Proceed with caution, as this action could disrupt active trading processes. Ensure all active trades are completed before making change?"
          HandleConfirm={() => {
            setConfirmationModal(false);
          }}
          isLoading={false}
        />
      )}
    </Box>
  );
};

const CopyBox = ({ address }) => {
  const [isShow, setIsShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Copied!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Unable to copy text", err);
      });
  };

  useEffect(() => {
    if (isShow) {
      const timer = setTimeout(() => {
        setIsShow(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isShow]);

  return (
    <TextField
      value={isShow ? address : "XXXXXXXXXXXXXXXXXX"}
      variant="outlined"
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            {isShow && (
              <IconButton
                onClick={handleCopyClick}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "2px",
                }}
                disabled={copied}
              >
                {copied ? <Check /> : <LuCopy />}
              </IconButton>
            )}
            <IconButton edge="end" onClick={() => setIsShow(!isShow)}>
              {isShow ? (
                <IoMdEyeOff cursor="pointer" color="#575765" />
              ) : (
                <IoMdEye cursor="pointer" color="#575765" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default RecentConnectedExchange;
