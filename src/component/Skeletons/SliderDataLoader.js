import React from "react";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "@material-ui/lab/Skeleton";
import { Box } from "@material-ui/core";
export default function SliderDataLoader({ height = 220, ...rest }) {
  return (
    <Box ml={1} mr={1}>
      <Box style={{ position: "relative" }}>
        <Skeleton height={height} animation="wave" {...rest} />
      </Box>
    </Box>
  );
}
