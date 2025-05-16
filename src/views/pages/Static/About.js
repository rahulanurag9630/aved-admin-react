import { Box, Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
const useStyles = makeStyles((theme) => ({
  aboutBox: {
    padding: "30px 0",
    [theme.breakpoints.down("xs")]: {
      padding: "35px 0",
    },
    "& p": {
      color: "#686868",
      marginBottom: "10px",
    },
    "& h5": {
      marginBottom: "10px",
      marginTop: "20px",
    },
    "& li": {
      color: "#686868",
      marginBottom: "10px",
      fontSize: "14px",
    },
  },
  heading: {
    textAlign: "start",
  },
  details: {},
}));
const About = () => {
  const classes = useStyles();

  return (
    <Box className={classes.aboutBox}>
      <Container maxWidth="lg">
        <Paper elevation={2}>
          <Box className={classes.heading}>
            <Typography variant="h2" color="primary">
              About Us
            </Typography>
          </Box>

          <Box className={classes.details} mt={2}>
            <Typography variant="body2">
              Get ready for an exhilarating ride with Fieres Blockchain, the
              trailblazing crypto engineering organisation that is transforming
              the digital asset landscape! With unbeatable speed, top-level
              security and scalability, our blockchain ecosystem offers a unique
              and unparalleled experience.
            </Typography>

            <Typography variant="body2">
              In the rapidly evolving world of blockchain and digital assets,
              Fieres Blockchain is positioned as the leading platform for Web
              3.0, Metaverse, non-fungible tokens (NFTs), decentralised finance
              (DeFi), and other future applications. Fieres Blockchain is built
              on a secure distributed ledger technology, offering a secure
              environment for data storage, verification, and transaction
              processing, which can be used as a trusted medium of exchange.
              This makes it an ideal platform for use in the enterprise sector
              and a cost-efficient and secure way of managing digital assets.
            </Typography>

            <Typography variant="body2">
              Fieres Blockchain's unique features make it the perfect platform
              for developing Metaverse and low transaction NFTs. Fieres supports
              smart contracts with fast transaction speeds, low energy
              consumption, and comprehensive features. Fieres Blockchain also
              supports the development of DeFi, enabling developers to build
              innovative financial products and applications.
            </Typography>

            <Typography variant="body2">
              Fieres Blockchain is well-suited to support future IoT and AI
              applications and build new-generation decentralised applications,
              smart contracts and distributed architectures. Its advanced
              security and scalability make it an ideal platform for developing
              collaborative applications.
            </Typography>
            <Typography variant="body2">
              In conclusion, Fieres Blockchain is the ideal platform for Web
              3.0, Metaverse, low transaction NFTs, DeFi, and other future
              applications, offering flexibility, cost-efficiency, and security.
            </Typography>
            <Typography variant="body2">
              Join us in revolutionising how people interact with digital
              assets, and discover the most scalable blockchain economy!
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
