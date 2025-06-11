import Topheading from "src/component/TopHeading";
import { Box, Button, Grid, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  main__wrapper: {
    display: "flex",
    flexDirection: "column",
    "& > button": {
      margin: "10px 0",
    },
  },
  top__info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  main__content: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflow: "auto",
    padding: "15px",
    borderRadius: "10px",
    // background: "#242030",
    // border: "1px solid #80808047",
    "& .MuiTypography-body2": {
      "@media(max-width:499px)": {
        wordBreak: "break-all",
      },
    },
    "& p": {
      margin: "0px",
      wordBreak: "break-all",
      fontSize: "14px !important",
      fontWeight: "500",
    },
  },
  details: {
    display: "flex",
    gap: "104px",
    alignSelf: "center",
    "& > div": {
      display: "flex",
      flexDirection: "column",
      gap: "36px",
      // alignItems: 'center',
    },
    "& img": {
      width: "200px",
      height: "100px",
      borderRadius: "5px",
    },
  },
}));

const ticketData = [
  {
    key: "name",
    label: "Name",
  },
  // {
  //   key: "subject",
  //   label: "Subject",
  // },
  {
    key: "message",
    label: "Description",
  },
  // {
  //   key: "firstName",
  //   label: "Customer Name",
  // },
  {
    key: "email",
    label: "Customer Email",
  },
  {
    key: "status",
    label: "Customer Ticket Status",
  },
  {
    key: "createdAt",
    label: "Requested Date & Time",
  },
  {
    key: "image",
    label: "Image",
  },
];

const PendingDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const ticketDetail = location.state.state;

  return (
    <Box className={classes.main__wrapper}>
      <Topheading heading="View Ticket Details" />
      <Box className={classes.main__content}>
        <Typography variant="h6" color="secondary">
          Ticket Details
        </Typography>
        {ticketData.map((item, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={4} sm={3} md={3}>
              <Typography
                variant="body2"
                style={{ fontWeight: 500, fontSize: "14px" }}
              >
                {ticketDetail[item.key] ? item.label : ""}
              </Typography>
            </Grid>
            <Grid item xs={0} sm={1}></Grid>
            <Grid item xs={7} sm={7} md={6} style={{ display: "flex" }}>
              {item.label == "Image" && ticketDetail[item.key] ? (
                <Box
                  sx={{
                    height: "137px",
                    borderRadius: "5px",
                  }}
                  mb={2}
                >
                  <img
                    src={ticketDetail && ticketDetail[item.key]}
                    alt="Attachment"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <>
                  {item.key == "createdAt" ? (
                    <Typography>
                      {moment(ticketDetail[item.key]).format("lll")}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="secondary"
                      dangerouslySetInnerHTML={{
                        __html:
                          ticketDetail && ticketDetail[item.key]
                            ? ticketDetail[item.key]
                            : " ",
                      }}
                    ></Typography>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        ))}
        {ticketDetail && ticketDetail.isReply && (
          <Grid container spacing={2}>
            <Grid item xs={4} sm={3} md={3}>
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                Solution Description
              </Typography>
            </Grid>
            <Grid item xs={0} sm={1}></Grid>
            <Grid item xs={7} sm={7} md={6}>
              <Typography
                variant="body2"
                style={{ wordBreak: "break-all" }}
                dangerouslySetInnerHTML={{
                  __html: ticketDetail.replyMessage,
                }}
              ></Typography>
            </Grid>
          </Grid>
        )}
        <Box align="left" mt={1} mb={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.goBack()}
          >
            Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PendingDetails;
