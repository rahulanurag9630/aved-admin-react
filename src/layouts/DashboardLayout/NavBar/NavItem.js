import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Collapse, ListItem, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { AuthContext } from "src/context/Auth";
import ConfirmationDialogBox from "src/component/ConfirmationDialogBox";
import toast from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "block",
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemLeaf: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: "10px",
    paddingRight: "20px",
  },
  button: {
    color: "#667085",
    padding: "13px 20px",
    justifyContent: "flex-start",
    textTransform: "none",
    marginBottom: "8px",
    letterSpacing: 0,
    width: "100%",
    fontWeight: "400",

    "&:hover": {
      color: "#ffff",
      background: "linear-gradient(359.12deg, #FF6600 9.14%, #3333FF 110.76%)",
      // borderRadius: "0px",
      borderRadius: "10px",
      "& $icon": {
        color: "#ffff",
      },
      "& $image": {
        color: "#ffff",
      },
    },
  },
  buttonLeaf: {
    color: "#667085",
    padding: "14px",
    display: "flex !important",
    alignItems: "center",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    marginBottom: "5px",
    borderRadius: "10px",
    opacity: 1,
    fontWeight: "400",
    fontSize: "13px",
    textDecoration: "none",
    "& $icon": {
      color: "#667085",
    },
    "& li": {
      "& $title": {
        marginLeft: "30px",
      },
    },
    "&:hover": {
      color: "#ffffff !important",
      background: "#11D9EF",

      "& $icon": {
        color: "#ffffff !important",
      },
      "& $image": {
        color: "#ffffff !important",
      },
    },
    "&.depth-0": {
      "& $title": {
        fontWeight: 400,
        fontSize: "13px",
        lineHeight: "17px",
        fontFamily: "Sora, sans-serif",
      },
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    minWidth: "20px",
    color: "rgba(255, 255, 255, 0.6)",
  },
  image: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    color: "rgba(255, 255, 255, 0.6)",
  },
  title: {
    marginRight: "auto",
  },
  active: {
    color: "#ffffff !important",
    background: "#11D9EF",
    fontWeight: theme.typography.fontWeightRegular,

    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: "#ffffff !important",
    },
    "& $image": {
      color: "#ffffff !important",
    },
  },
}));

const NavItem = ({
  children,
  className,
  depth,
  href,
  img,
  icon: Icon,
  info: Info,
  open: openProp,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(openProp);
  const history = useHistory();
  const [isLogout, setIsLogout] = useState(false);
  const auth = useContext(AuthContext);
  const isActive = window.location.pathname === href;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  if (children) {
    return (
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        key={title}
        {...rest}
      >
        <Button className={classes.button} onClick={handleToggle}>
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <>
      <ListItem
        className={clsx(classes.itemLeaf, className)}
        disableGutters
        key={title}
        {...rest}
      >
        <a
          href={href}
          className={clsx(
            classes.buttonLeaf,
            `depth-${depth}`,
            isActive && classes.active
          )}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default navigation to handle programmatically.
            if (title === "Logout") {
              setIsLogout(true);
            } else {
              // history.push(href, {
              //   isEdit:
              //     auth?.userData?.userType === "ADMIN"
              //       ? true
              //       : rest?.item?.isEdit,
              // });
              history.push(href, {isEdit: true});
            }
          }}
        >
          {Icon && <Icon className={classes.icon} size="20" />}
          {img && <img src={img} className={classes.image} size="20" alt="" />}
          <span className={`titletext ${classes.title}`}>{title}</span>
          {Info && <Info />}
        </a>
        {isLogout && (
          <ConfirmationDialogBox
            openModal={isLogout}
            handleClose={() => setIsLogout(false)}
            heading="Logout"
            description={`Are you sure, you want to logout?`}
            HandleConfirm={() => {
              toast.success("Logout Successfully!");
              auth.handleLogout();
              history.replace("/");
            }}
            isLoading={false}
          />
        )}
      </ListItem>
    </>
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  img: PropTypes.elementType,
  info: PropTypes.elementType,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

NavItem.defaultProps = {
  open: false,
};

export default NavItem;
