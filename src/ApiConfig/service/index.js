import axios from "axios";
import ApiConfig from "../ApiConfig";

export const apiRouterCall = async ({
  method,
  endPoint,
  bodyData,
  paramsData,
  token,
  id,
  source,
}) => {
  try {
    return await axios({
      method: method,
      url: id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint],
      headers: {
        token: token ? token : window.localStorage.getItem("token"),
      },
      data: bodyData ? bodyData : null,
      params: paramsData ? paramsData : null,
      cancelToken: source ? source.token : null,
    });
  } catch (error) {
    console.log(error);
    if (error?.response) {
      return error?.response;
    } else {
      return { data: { responseMessage: error?.message } };
    }
  }
};
