import MainFilter from "src/component/MainFilter";
import { Box, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import Topheading from "src/component/TopHeading";
import UserDetailsMain from "./UserDetailsMain";

export default function UserManagment() {
  return (
    <Box>
      <Box mb={2}>
        <Topheading heading="User Details" searchname="Search here..." />
      </Box>
      <Paper elevation={2}>
        <UserDetailsMain />
      </Paper>
    </Box>
  );
}
