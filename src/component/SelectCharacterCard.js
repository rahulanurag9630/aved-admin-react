/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { makeStyles, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5px 8px",
    marginTop: "80px",
    cursor: "pointer",
    "& .hoverbox": {
      cursor: "pointer",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 4,
      "&:hover": {
        "& .textBox1": {
          display: "block",
        },
      },
      "& .textBox1": {
        top: "-80px",
        left: "3%",
        border: "1px solid #FFFFFF",
        display: "none",
        zIndex: "999",
        position: "absolute",
        borderRadius: "8px",
        padding: "5px 4px",
        [theme.breakpoints.only("xs")]: {
          left: "0",
        },
        "& h5": {
          fontSize: "12px",
        },
        "&::after": {
          content: "''",
          position: "absolute",
          left: "35%",
          top: "100%",
          width: "0",
          height: "0",
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderTop: "20px solid #e8e8e8",
          clear: "both",
        },
      },
    },
  },
  mainimg: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 8px 8px 8px",
    background: "url(images/SelectCharacterBgImage.png)",
    background:
      "linear-gradient(0deg, #161616, #161616),radial-gradient(62.66% 62.66% at 50% 50%, #FF282D 0%, rgba(0, 0, 0, 0) 100%)",

    border: "1px solid #626262",
    padding: "8px 0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& figure": {
      margin: "0px",
      width: "115px",
      height: "115px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "&:hover": {
      border: "1px solid transparent",
      boxShadow:
        "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
    },
    "& .shadoweffect": {
      position: "absolute",
      // boxShadow: "0px 0px 20px #EB4AED",
      backgroundImage:
        "radial-gradient(36.67% 9.68% at 67.26% 8.27%, rgb(251, 1, 154) 0%, rgb(251, 1, 154) 95.78%)",
      opacity: 0.55,
      filter: "blur(75px)",
      width: "150px",
      height: "100px",
      // zIndex: "999",
      borderRadius: "100px",
      top: "130px",
      left: "22%",
    },
  },
  carMainBoxHover: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 8px 8px 8px",
    background: "url(images/SelectCharacterBgImage.png)",
    padding: "8px 0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& figure": {
      margin: "0px",
      width: "115px",
      height: "115px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    background:
      "linear-gradient(0deg, #161616, #161616),radial-gradient(62.66% 62.66% at 50% 50%, #FF282D 0%, rgba(0, 0, 0, 0) 100%)",

    border: "1px solid transparent",
    boxShadow:
      "0 2px 0 0 #ec0066, 0 -1px 0 0 #7e46a1, 2px 0 0 0 #7101bc, -2px 0 0 0 #ff4237, 1px 1px 0 0 #ec0066, -2px 2px 0 0 #ec0066, 2px 1px 0 0 #ec0066, -1px -2px 0 0 #ec0066",
  },
}));

function SelectCharacterCard(props) {
  const classes = useStyles();
  const { data, index, setCharacterIndex, carData } = props;

  return (
    <>
      <Box className={classes.root} onClick={() => setCharacterIndex(index)}>
        <Box className="hoverbox">
          <Box
            className={
              carData === index ? classes.carMainBoxHover : classes.mainimg
            }
          >
            <Box className="shadoweffect"></Box>

            <Box>
              <figure>
                <img src={data?.image} alt={data?.text} />
              </figure>
              <Box mt={1} align="center">
                <Typography variant="h4" style={{ fontSize: "16px" }}>
                  {data?.text}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* <Box
            className="textBox1"
            style={
              carData && carData === index
                ? {
                    display: "block",
                  } 
                : { display: "none" }
            }
          >
            {window.location.pathname === "/character-selection" && (
              <Typography variant="h5">All Characters</Typography>
            )}
            {window.location.pathname === "/component-selection" && (
              <Typography variant="h5">Available Component</Typography>
            )}
          </Box> */}
        </Box>
      </Box>
    </>
  );
}

export default React.memo(SelectCharacterCard);
