import {
  Box,
  Drawer,
  Hidden,
  List,
  Button,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, matchPath, useHistory } from "react-router-dom";
import {
  FaExchangeAlt,
  FaNewspaper,
  FaTicketAlt,
  FaUserAlt,
} from "react-icons/fa";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PropTypes from "prop-types";
import NavItem from "./NavItem";
import {
  MdContentPaste,
  MdDashboard,
  MdQuestionAnswer,
  MdSettings,
  MdSubscriptions,
  MdTipsAndUpdates,
  
} from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";


import { AuthContext } from "src/context/Auth";
import { HiUsers } from "react-icons/hi";
import { RiRefund2Line } from "react-icons/ri";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";

export const dashboardArray = [
  {
    items: [
      // {
      //   title: "Dashboard",
      //   icon: MdDashboard,
      //   href: "/dashboard",
      //   isEdit: true,
      // },
    ],
  },
];
export const sections = [
  {
    items: [
      {
        title: "Dashboard",
        icon: MdDashboard,
        href: "/dashboard",
        isEdit: false,
      },
      {
        title: "User Management",
        icon: FaUserAlt,
        href: "/usermanagement",
        isEdit: false,
      },

      // {
      //   title: "Reward Management",
      //   icon: GrMoney,
      //   href: "/reward-management",
      //   isEdit: false,
      // },

      // {
      //   title: "CWN Transaction Management",
      //   icon: RiRefund2Line,
      //   href: "/wallet-management",
      //   isEdit: false,
      // },

      // {
      //   title: "Fuel transaction Mnagement",
      //   icon: MdOutlineAccountBalanceWallet,
      //   href: "/fuel-management",
      //   isEdit: false,
      // },
      // {
      //   title: "Exchanges",
      //   icon: FaExchangeAlt,
      //   href: "/list-exchanges",
      //   isEdit: false,
      // },
      // {
      //   title: "Trade Management",
      //   icon: VscGraph,
      //   href: "/trade-management",
      //   isEdit: false,
      // },
      // {
      //   title: "API Management",
      //   icon: TbApi,
      //   href: "/api-management",
      //   isEdit: false,
      // },
      // {
      //   title: "Whitelist Management",
      //   icon: FaNewspaper,
      //   href: "/whitelist-management",
      //   isEdit: false,
      // },
     
      {
        title: "Tips & Events Management",
        icon: MdTipsAndUpdates,
        href: "/tips-management",
        isEdit: false,
      },
      {
        title: "Chat Management",
        icon: IoMdChatbubbles,
        href: "/chat-management",
        isEdit: false,
      },
      {
        title: "Subscription Management",
        icon: MdSubscriptions,
        href: "/subscription-management",
        isEdit: false,
      },
      {
        title: "Transaction Management",
        icon: GrTransaction,
        href: "/transaction-management",
        isEdit: false,
      },
     
       {
        title: "Blog Management",
        icon: HiUsers,
        href: "/blog-management",
        isEdit: false,
      },
      // {
      //   title: "Sub Admin Management",
      //   icon: HiUsers,
      //   href: "/sub-admin-management",
      //   isEdit: false,
      // },
      // {
      //   title: "Sub-Admin Activity",
      //   icon: MdSubscriptions,
      //   href: "/subadmin-activity",
      //   isEdit: false,
      // },
      {
        title: "FAQ Management",
        icon: MdQuestionAnswer,
        href: "/faq",
        isEdit: false,
      },
      {
        title: "Static Content Management",
        icon: MdContentPaste,
        href: "/static",
        isEdit: false,
      },
      {
        title: "Ticket Management",
        icon: FaTicketAlt,
        href: "/ticket-management",
        isEdit: false,
      },

     
    ],
  },
];

export const settingArray = [
  {
    items: [
      {
        title: "Settings",
        icon: MdSettings,
        href: "/setting",
        isEdit: true,
      },
      {
        title: "Logout",
        icon: ExitToAppIcon,
      },
    ],
  },
];

function renderNavItems({ items, pathname, depth = 0 }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, img, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        img={item.img}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
        item={item}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        img={item.img}
        info={item.info}
        key={key}
        title={item.title}
        item={item}
        // target="_blank"
      />
    );
  }
  return acc;
}
const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 296,
    background: "#fff",
    overflowX: "hidden",
  },
  desktopDrawer: {
    top: "78px",
    width: "245px",
    height: "100% ",
    padding: "10px",
    background: "#ffffff",
    borderRadius: "0px",
  },
  logoutButton: {
    left: "15px",
    // bottom: "128px",
    display: "flex",
    // position: "absolute",
    fontSize: "13px",
    background: "transparent",
    alignItems: "center",
    fontWeight: "400",
    color: "#667085",

    justifyContent: "start",
  },
  sideMenuBox: {
    "& .MuiCollapse-wrapperInner": {
      marginLeft: "45px",
    },
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const checkArray = useMemo(() => {
    let filteredItems;

    const permissions = auth?.userData?.permissions || [];
    filteredItems = sections?.flatMap((section) =>
      section.items
        .map((item) => {
          const permission = permissions?.find(
            (perm) => perm?.name === item?.title
          );
          return { ...item, isEdit: permission ? permission?.isEdit : false };
        })
        .filter((item) =>
          permissions?.some((perm) => perm?.name === item?.title)
        )
    );

    return auth?.userData?.userType === "SUBADMIN"
      ? [...dashboardArray, { items: filteredItems }, ...settingArray]
      : [...dashboardArray, ...sections, ...settingArray];
  }, [auth?.userData?.permissions, sections]);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box className="sideMenuBox1" pt={0.5} pb={2}>
        {checkArray?.map((section, i) => (
          <List
            key={`menu${i}`}
            subheader={
              <ListSubheader disableGutters disableSticky>
                {section.subheader}
              </ListSubheader>
            }
          >
            {renderNavItems({
              img: section.img,
              items: section.items,
              pathname: location?.pathname,
            })}
          </List>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden mdUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          <Box p={2}>{content}</Box>
        </Drawer>
      </Hidden>
      <Hidden xsDown>{content}</Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
