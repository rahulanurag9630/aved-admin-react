import { Box, Typography, Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import Page from "src/component/Page";
export default function NotFound(props) {
  const history = useHistory();
  return (
    <Page title="page not found!">
      <Box pt={20} textAlign="center">
        {/* <Typography variant="h2" align="center">
          Oops!
        </Typography> */}
        {/* <Typography variant="h2" align="center" paragraph>
          404 Not Found
        </Typography> */}
        <Box>
          <img
            src="images/PageNotFoundImage.png"
            alt="pageNotFoundImage"
            width="30%"
          />
        </Box>
        <Typography variant="h4" align="center" paragraph>
          Sorry, an error has occured, Requested page not found!
        </Typography>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/")}
          >
            Go to Home Page
          </Button>
        </Box>
      </Box>
    </Page>
  );
}
