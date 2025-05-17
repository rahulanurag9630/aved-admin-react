import React, { useState, useEffect } from "react";
import { Box, Button, Container, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
const Root1 = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  height: "100vh",
  "& .MainLayoutmain": {
    height: "100vh",
    display: "flex",
    zIndex: "9",
    position: "relative",
    background: "#FFFFFF",
  },
  "& .MainLayout": {
    height: "calc(100vh - 64px)",
    position: "relative",
    overflowY: "auto",
    paddingTop: "80px",
  },
  "& .loginlayoutleftSide": {
    width: "40%",
    height: "100vh",
    background: "#2752E7",
    // backgroundImage: "url(/images/login_back.png)",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    // WebkitBackgroundPosition: "top right",
    // backgroundPosition: "top right",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  "& .rightlayoutleftSide": {
    right: "0",
    width: "60%",
    height: "100vh",
    zIndex: "1",
    position: "absolute",

    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
  },
  "& .loginLogo": {
    width: "auto",
    maxWidth: "350px",
  },
  "& .containerBox": {
    [theme.breakpoints.down("lg")]: {
      paddingRight: "36px",
      paddingLeft: "36px",
    },
  },
  "& .sideLayout": {
    marginTop: "12%",
  },
  "& .sideLayout1": {
    maxWidth: "470px",

    [theme.breakpoints.down("lg")]: {
      maxWidth: "439px",
    },
    "@media(max-width: 350px)": {
      maxWidth: "390px",
    },
    "& .gridSecond": {
      "& .body2": {
        margin: "10px 0",
      },
    },
  },
}));
export const btnArr = [
  { name: "Contact Us", route: "/" },
  { name: "Terms", route: "/" },
  { name: "Policy", route: "/" },
];
export default function LoginLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <Root1>
      <div className="MainLayoutmain">
        <Box className="loginlayoutleftSide">
          <Box className="sideLayout" align="center" mb={4}>
            <Link href={`/`}>
              <Box className="mvpLogo">
                <img src="/images/footer_logo.svg" className="loginLogo" />
              </Box>
            </Link>
            <Typography
              variant="body1"
              color="#fff"
              mt={3}
              style={{ lineHeight: "24px" }}
            >
              Your all in one solution for crypto trading and exchange
            </Typography>

            <Typography
              variant="body1"
              color="#fff"
              mt={1}
              style={{ lineHeight: "24px" }}
            >
              Quick , Secure & Reliable
            </Typography>
          </Box>
          <Image
            width="471"
            height="447"
            src="/images/bgLogin.png"
            style={{ mixBlendMode: "lighten", width: "auto" }}
            layout="responsive"
            className="loginlayoutimg"
          />
        </Box>
        <Box className="rightlayoutleftSide">
          <Box className="sideLayout1">
            <Container className="containerBox">
              <Link href={`/`}>
                <Box className="mvpLogo mvpLogo1" align="center">
                  <Logo />
                </Box>
              </Link>
              {children}
            </Container>
          </Box>
        </Box>
      </div>
    </Root1>
  );
}
