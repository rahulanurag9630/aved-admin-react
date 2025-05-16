import React from "react";
import { Box } from "@material-ui/core";
import Page from "src/component/Page";
import Login from "../Auth/Login";

function Home(props) {
  return (
    <Page title="MUIRL">
      <Box>
        <Login />
      </Box>
    </Page>
  );
}

export default Home;
