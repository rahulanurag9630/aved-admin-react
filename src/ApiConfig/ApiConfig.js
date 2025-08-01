// export const baseurl = process.env.REACT_APP_BASE_URL;
// export const baseurl = "http://192.168.123.33:2211"
// export const baseurl = "http://localhost:2211"
export const baseurl = "https://aved-node.onrender.com"

///////////////////local///////////////
// export const baseurl = "http://172.16.1.254:2154";

export const currency = process.env.REACT_APP_CURRENCY;

let base = `${baseurl}/api/v1`;
const ApiConfig = {
  login: `${base}/admin/login`,
  getAdminDetails: `${base}/admin/getAdminDetails`,
  updateAdminDetails: `${base}/admin/updateAdminDetails`,
  updateTeamOrder: `${base}/admin/updateTeamOrder`,


  getProfile: `${base}/admin/getProfile`,
  resendOTP: `${base}/admin/resendOTP`,
  verifyOTP: `${base}/admin/verifyOTP`,
  forgotPassword: `${base}/admin/forgetPassword`,
  resetPassword: `${base}/admin/resetPassword`,
  addOrUpdateBlog: `${base}/admin/addOrUpdateBlog`,
  toggleBlockStatus: `${base}/admin/toggleBlockStatus`,
  deleteBlog: `${base}/admin/deleteBlog`,
  listBlogs: `${base}/admin/listBlogs`,
  addOrUpdateTeam: `${base}/admin/addOrUpdateTeam`,
  listTeam: `${base}/admin/listTeam`,
  toggleBlockTeamStatus: `${base}/admin/toggleBlockTeamStatus`,
  deleteTeam: `${base}/admin/deleteTeam`,


  listContactUs: `${base}/contact/listContactUs`,
  replyContactUs: `${base}/contact/replyContactUs`,







  dashboard: `${base}/admin/dashboard`,
  getUserList: `${base}/admin/getUserList`,
  blockUnblockUser: `${base}/admin/blockUnblockUser`,
  transactionList: `${base}/admin/transactionList`,
  createSubAdmin: `${base}/admin/createSubAdmin`,
  updateSubAdmin: `${base}/admin/updateSubAdmin`,
  deleteUser: `${base}/admin/deleteUser`,
  subAdminActivityList: `${base}/admin/subAdminActivityList`,
  changePassword: `${base}/admin/changePassword`,

  getWhiteListedAddress: `${base}/admin/getWhiteListedAddress`,
  addWhiteListedAddress: `${base}/admin/addWhiteListedAddress`,
  removeWhiteListedAddress: `${base}/admin/removeWhiteListedAddress`,
  poolDashboard: `${base}/admin/poolDashboard`,
  userData: `${base}/admin/userData`,
  userBuyData: `${base}/admin/userBuyData`,
  userDepositData: `${base}/admin/userDepositData`,
  poolData: `${base}/admin/poolData`,
  editUser: `${base}/admin/editUser`,

  /////////////User////////////////////////
  checkEmail: `${base}/user/checkEmail`,

  ///////////static//////
  listStaticContent: `${base}/staticContent/getAllStaticContent`,
  addStaticContent: `${base}/staticContent/addStaticContent`,
  editStaticContent: `${base}/static/editStaticContent`,
  addFAQ: `${base}/static/addFAQ`,
  faqList: `${base}/staticContent/getAllStaticContentByType`,
  updateStaticContent: `${base}/staticContent/updateStaticContent`,
  deleteStaticContent: `${base}/staticContent/deleteStaticContent`,
  listAllContactUsRequest: `${base}/static/listAllContactUsRequest`,

  //////////Exchange////////
  closeOpenOrdersAll: `${base}/wallet/closeOpenOrdersAll`,
  closePositionAllNew: `${base}/wallet/closePositionAllNew`,
  manageCopyTrading: `${base}/wallet/manageCopyTrading`,
  connectExchanges: `${base}/wallet/connectExchanges`,
  listExchanges: `${base}/wallet/listExchanges`,
  serverIPAddress: `${base}/wallet/serverIPAddress`,
  listMyExchanges: `${base}/wallet/listMyExchanges`,
  editExchanges: `${base}/wallet/editExchanges`,
  getBalance: `${base}/wallet/getBalance`,
  copyTradingDashBoard: `${base}/wallet/copyTradingDashBoard`,
  disconnectExchanges: `${base}/wallet/disconnectExchanges`,

  ///Trade Management//
  orderHistory: `${base}/wallet/orderHistory`,
  positionHistory: `${base}/wallet/positionHistory`,
  userExchangeData: `${base}/wallet/userExchangeData`,
  userExchangeManagement: `${base}/wallet/userExchangeManagement`,
  orderHistoryAdmin: `${base}/wallet/orderHistoryAdmin`,
  closePosition: `${base}/wallet/closePosition`,
  ///////////////////////////////////////////////////////////////////////////
  addUpdateAmenities: `${base}/admin/addUpdateAmenities`,
  toggleAmenityStatus: `${base}/admin/toggleAmenityStatus`,
  listAmenities: `${base}/admin/listAmenities`,
  uploadFile: `${base}/user/uploadFile`,
  addUpdateProperty: `${base}/property/addUpdateProperty`,
  listProperties: `${base}/property/listProperties`,
  toggleBlockProperty: `${base}/property/toggleBlockProperty`,
  deleteProperty: `${base}/property/deleteProperty`,
  getDashboardData: `${base}/admin/getDashboardData`,


};

export default ApiConfig;
