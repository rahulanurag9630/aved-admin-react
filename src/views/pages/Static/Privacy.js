import { Box, Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {
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
    "& h1": {
      // color: "#000",
      fontSize: "40px",
      fontWeight: "700",
      [theme.breakpoints.down("xs")]: {
        fontSize: "23px",
      },
    },
  },
  details: {
    "& h4": {
      fontSize: "15px",
      lineHeight: "25px",
    },
  },
  colorbox: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    padding: "10px",
    background:
      " linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
    border: "1px solid #A8CEDF",
    backdropFilter: "blur(42px)",
  },
}));
const Privacy = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Paper elevation={2}>
          <Box className={classes.heading}>
            <Typography variant="h2" color="primary">
              Privacy Policy
            </Typography>
          </Box>
          <Box className={classes.details} mt={2}>
            <Typography variant="body2">
              Last updated: November 9, 2023
            </Typography>
            <Typography variant="body2">
              Https://rapidrush.io/ (“us”, “we”, or “our”) operates the
              Https://rapidrush.io/ website (the “Service”).
            </Typography>
            <Typography variant="body2">
              This page informs you of our policies regarding the collection,
              use and disclosure of Personal Information when you use our
              Service.
            </Typography>
            <Typography variant="body2">
              We will not use or share your information with anyone except as
              described in this Privacy Policy.
            </Typography>
            <ol>
              <li>
                We will not use or share your information with anyone except as
                described in this Privacy Policy." could be replaced with "We
                are committed to protecting your privacy. We will only use or
                share your information as described in this Privacy Policy."
              </li>
              <li>
                We may employ third party companies and individuals to
                facilitate our Service, to provide the Service on our behalf, to
                perform Service-related services or to assist us in analyzing
                how our Service is used." could be replaced with "We may work
                with third-party service providers to help us provide our
                Service. These third-party providers may have access to your
                personal information only to perform their specific tasks and
                are prohibited from using your information for any other
                purpose."
              </li>
              <li>
                We do not knowingly collect personally identifiable information
                from children under 18." could be replaced with "We do not
                collect personal information from children under the age of 18.
                If you believe that your child has provided us with personal
                information, please contact us and we will delete it
                immediately."
              </li>
              <li>
                We will disclose your Personal Information where required to do
                so by law or subpoena." could be replaced with "We may disclose
                your personal information if required to do so by law or if we
                believe that disclosure is necessary to protect our rights or
                the rights of others."
              </li>
            </ol>

            <Typography variant="h5">Information Collection And Use</Typography>
            <Typography variant="body2">
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you. Personally identifiable information (“Personal
              Information”) may include, but is not limited to: 1.Name, 2.Email
              address.
            </Typography>
            <Typography variant="h5">Log Data</Typography>
            <Typography variant="body2">
              We collect information that your browser sends whenever you visit
              our Service (“Log Data”). This Log Data may include information
              such as your computer’s Internet Protocol (“IP”) address, browser
              type, browser version, the pages of our Service that you visit,
              the time and date of your visit, the time spent on those pages and
              other statistics.
            </Typography>
            <Typography variant="h5">Cookies</Typography>
            <Typography variant="body2">
              Cookies are files with small amount of data, which may include an
              anonymous unique identifier. Cookies are sent to your browser from
              a web site and stored on your computer’s hard drive.
            </Typography>
            <Typography variant="body2">
              We use “cookies” to collect information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent. However, if you do not accept cookies, you may not be
              able to use some portions of our Service.
            </Typography>
            <Typography variant="h5">Service Providers</Typography>
            <Typography variant="body2">
              We may employ third party companies and individuals to facilitate
              our Service, to provide the Service on our behalf, to perform
              Service-related services or to assist us in analyzing how our
              Service is used.
            </Typography>
            <Typography variant="body2">
              These third parties have access to your Personal Information only
              to perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </Typography>
            <Typography variant="h5">Security</Typography>
            <Typography variant="body2">
              The security of your Personal Information is important to us, but
              remember that no method of transmission over the Internet, or
              method of electronic storage is 100% secure. While we strive to
              use commercially acceptable means to protect your Personal
              Information, we cannot guarantee its absolute security.
            </Typography>
            <Typography variant="h5">Links To Other Sites</Typography>
            <Typography variant="body2">
              Our Service may contain links to other sites that are not operated
              by us. If you click on a third party link, you will be directed to
              that third party’s site. We strongly advise you to review the
              Privacy Policy of every site you visit.
            </Typography>
            <Typography variant="body2">
              We have no control over, and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </Typography>
            <Typography variant="h5">Children is Privacy</Typography>
            <Typography variant="body2">
              Our Service does not address anyone under the age of 18
              (“Children”). We do not knowingly collect personally identifiable
              information from children under 18. If you are a parent or
              guardian and you are aware that your child has provided us with
              Personal Information, please contact us. If we discover that a
              child under 18 has provided us with Personal Information, we will
              delete such information from our servers immediately.
            </Typography>

            <Typography variant="h5">Compliance With Laws</Typography>
            <Typography variant="body2">
              We will disclose your Personal Information where required to do so
              by law or subpoena.
            </Typography>

            <Typography variant="h5">Changes To This Privacy Policy</Typography>
            <Typography variant="body2">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </Typography>
            <Typography variant="body2">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </Typography>

            <Typography variant="h5">Contact Us</Typography>
            <Typography variant="body2">
              If you have any questions about this Privacy Policy, please
              contact us.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy;
