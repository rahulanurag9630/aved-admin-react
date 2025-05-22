import React from "react";
import { Box, Typography, Divider, Container } from "@material-ui/core";

const Footer = () => {
  return (
    <Box mb={2}>
      <Container maxWidth="fixed">
        <Divider className="borderBox" />
        <Box className="displayCenter">
          <Typography
            variant="body2"
            color="primary"
            style={{ fontSize: "14px" }}
          >
            &copy;2025 AVED. All Right Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
