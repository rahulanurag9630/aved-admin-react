import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box, withStyles } from "@material-ui/core";

const styles = (theme) => ({
  circularProgress: {
    color: "#52565c",
    padingRight: "50px",
  },
});

function ButtonCircularProgress(props) {
  const { size, classes } = props;
  return (
    <Box
      color="secondary.main"
      display="flex"
      style={{
        display: "flex",
        justifyContent: "center",
        marginLeft: "10px",
        // marginTop: "20px",
      }}
    >
      <CircularProgress
        size={size ? size : 22}
        thickness={size ? (size / 5) * 30 : 6}
        className={classes.circularProgress}
      />
    </Box>
  );
}

ButtonCircularProgress.propTypes = {
  size: PropTypes.number,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ButtonCircularProgress);
