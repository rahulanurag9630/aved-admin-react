// export const baseurl = process.env.REACT_APP_BASE_URL;
export const baseurl = "http://localhost:2211"

///////////////////local///////////////
// export const baseurl = "http://172.16.1.254:2154";

export const currency = process.env.REACT_APP_CURRENCY;

let base = `${baseurl}/api/v1`;
const ApiConfig = {
  login: `${base}/admin/login`,
  getProfile: `${base}/admin/getProfile`,
  resendOTP: `${base}/admin/resendOTP`,
  verifyOTP: `${base}/admin/verifyOTP`,
  forgotPassword: `${base}/admin/forgotPassword`,
  resetPassword: `${base}/admin/resetPassword`,
  addOrUpdateBlog: `${base}/admin/addOrUpdateBlog`,
  toggleBlockStatus: `${base}/admin/toggleBlockStatus`,
  deleteBlog: `${base}/admin/deleteBlog`,
listBlogs: `${base}/admin/listBlogs`,


  
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
  listStaticContent: `${base}/static/listStaticContent`,
  editStaticContent: `${base}/static/editStaticContent`,
  addFAQ: `${base}/static/addFAQ`,
  faqList: `${base}/static/faqList`,
  editFAQ: `${base}/static/editFAQ`,
  deleteFAQ: `${base}/static/deleteFAQ`,
  listAllContactUsRequest: `${base}/static/listAllContactUsRequest`,
  replyContactUs: `${base}/static/replyContactUs`,

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
  addUpdateAmenities: `${base}/admin/addUpdateAmenities`,
  toggleAmenityStatus: `${base}/admin/toggleAmenityStatus`,
  listAmenities: `${base}/admin/listAmenities`,
  uploadFile: `${base}/user/uploadFile`,
};

export default ApiConfig;
