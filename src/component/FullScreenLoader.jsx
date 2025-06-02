import React from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";

const FullScreenLoader = ({ isLoading, message = "Loading..." }) => {
    if (!isLoading) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255, 255, 255, 0.2)"
            zIndex={1300} // higher than default MUI z-index
        >
            <CircularProgress
                style={{ color: "#5c4d44" }}
                size={60}
                thickness={4}
            />
            <Typography
                variant="subtitle1"
                style={{ color: "#5c4d44", marginTop: 16 }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default FullScreenLoader;
