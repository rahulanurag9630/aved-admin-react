import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import HomeLayout from "src/layouts/HomeLayout";
import DashboardLayout from "src/layouts/DashboardLayout";

import LoginLayout from "./layouts/LoginLayout/inedx";

export const routes = [
  {
    exact: true,
    path: "/",
    layout: LoginLayout,
    component: lazy(() => import("src/views/pages/Home")),
  },
  {
    exact: true,
    path: "/profile",
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import("src/views/pages/Profile/ProfileUser")),
  },
  {
    exact: true,
    path: "/edit-profile-user",
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import("src/views/pages/Profile/EditProfile")),
  },
  {
    exact: true,
    path: "/ticket-management",
    guard: true,
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/TicketManagement/TicketManagement")
    ),
  },
  {
    exact: true,
    path: "/pending-ticket",
    guard: true,
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/TicketManagement/PendingDetails")
    ),
  },
  {
    exact: true,
    path: "/login",
    layout: LoginLayout,
    component: lazy(() => import("src/views/pages/Auth/Login")),
  },
  {
    exact: true,
    path: "/verify-otp",
    layout: LoginLayout,
    component: lazy(() => import("src/views/pages/Auth/Verifyotp")),
  },
  {
    exact: true,
    path: "/forget",
    layout: LoginLayout,
    component: lazy(() => import("src/views/pages/Auth/Forgot")),
  },
  {
    exact: true,
    path: "/reset",
    layout: LoginLayout,
    component: lazy(() => import("src/views/pages/Auth/Reset")),
  },
  {
    exact: true,
    guard: true,
    path: "/user-profile",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Profile/ProfileUser")),
  },
  {
    exact: true,
    guard: true,
    // path: "/change-password",
    path: "/setting",
    layout: DashboardLayout,
    // component: lazy(() =>
    //   import("src/views/pages/Admin/Setting/Changepassword")
    // ),
    component: lazy(() => import("src/views/pages/Admin/Setting/SettingTab")),
  },
  {
    exact: true,
    guard: true,
    path: "/dashboard",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/Dashboard/DashboardHome")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/usermanagement",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/UserManagement/UserManagment")
    ),
  },
  // {
  //   exact: true,
  //   guard: true,
  //   path: "/whitelist-management",
  //   layout: DashboardLayout,
  //   component: lazy(() =>
  //     import("src/views/pages/Admin/WhitelistManangement/WhitelistTable")
  //   ),
  // },
  {
    exact: true,
    guard: true,
    path: "/static",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/Static/index")),
  },
  {
    exact: true,
    guard: true,
    path: "/faq",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/Static/FaqManagement")),
  },
  {
    exact: true,
    guard: true,
    path: "/view-content",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/Static/ViewStatic")),
  },
  {
    exact: true,
    guard: true,
    path: "/static-content",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/Static/EditContent")),
  },
  {
    exact: true,
    guard: true,
    path: "/notification",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/Static/Notification")),
  },

   {
    exact: true,
    guard: true,
    path: "/blog-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Blog/index")
    ),
  },
    {
    exact: true,
    guard: true,
    path: "/add-blog-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Blog/AddBlog")
    ),
  },
  // {
  //   exact: true,
  //   guard: true,
  //   path: "/sub-admin-management",
  //   layout: DashboardLayout,
  //   component: lazy(() =>
  //     import("src/views/pages/Admin/SubAdminManagement/index")
  //   ),
  // },

  {
    exact: true,
    guard: true,
    path: "/add-sub-admin",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/SubAdminManagement/AddNewSubAdmin")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/view-sub-admin",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/SubAdminManagement/AddNewSubAdmin")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/chat-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/ChatManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/view-chat",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/ChatManagement/ChatList")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/subscription-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/SubscriptionManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-subscription",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/SubscriptionManagement/AddSubscription")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transaction-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/TransactionManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/subadmin-activity",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/SubAdminActivity/index")
    ),
  },

  {
    exact: true,
    guard: true,
    path: "/wallet-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/WalletManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/trade-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/TradeManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/api-management",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/ApiManagement/index")),
  },

  {
    exact: true,
    guard: true,
    path: "/fuel-management",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/FuelManagement/index")),
  },
  {
    exact: true,
    guard: true,
    path: "/reward-management",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/FundsManagement/index")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/user-details",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/UserManagement/UserDetails")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/confirmation-dialog",
    layout: DashboardLayout,
    component: lazy(() => import("src/component/ConfirmationDialogBox")),
  },
  {
    exact: true,
    guard: true,
    path: "/rewards-dialog",
    layout: DashboardLayout,
    component: lazy(() => import("src/component/RewardsDialogBox")),
  },

  {
    exact: true,
    guard: true,
    path: "/userlisted-nftdetails",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/UserManagement/UserListedNftDetails")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/userlisted-nft",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/UserManagement/UserListedNFTs")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transaction-managemet",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Admin/TransactionManagment/TransactionManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/exchanges",
    layout: DashboardLayout,
    component: lazy(() =>
      import("src/views/pages/Exchanges/ExchangeManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/list-exchanges",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Exchanges/ExchangeIndex")),
  },
  {
    exact: true,
    guard: true,
    path: "/tips-management",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/TipsManagement/index.js")),
  },
  {
    exact: true,
    guard: true,
    path: "/add-tips",
    layout: DashboardLayout,
    component: lazy(() => import("src/views/pages/Admin/TipsManagement/AddTips")),
  },
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("src/views/errors/NotFound")),
  },
  {
    component: () => <Redirect to="/404" />,
  },
];
