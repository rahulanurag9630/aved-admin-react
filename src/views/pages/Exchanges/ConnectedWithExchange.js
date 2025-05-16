import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Typography,
  Paper,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { toast } from "react-hot-toast";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { MenuProps, funConEx, sortAddress } from "src/utils";
import { apiRouterCall } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { AuthContext } from "src/context/Auth";
import CopyToClipboard from "react-copy-to-clipboard";
import { LuCopy } from "react-icons/lu";

const ConnectExchangeBox = ({ editExchangeData, setEditExchangeData }) => {
  const [exchangeList, setExchangeList] = useState([]);
  const [isRemember, setIsRemember] = useState(false);
  const [serverIPAddress, setServerIPAddress] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const auth = useContext(AuthContext);
  const [exchnageType, setExchangeType] = useState(0);
  let maxAPILength = 510;
  const formInitialSchema = {
    apikey: editExchangeData?.apiKey || "",
    secretkey: editExchangeData?.apiSecret || "",
    exchnageType: editExchangeData?.exchangeName || "",
  };

  const formValidationSchema = yup.object().shape({
    exchnageType: yup.string().required("Please select your exchange."),
    apikey: yup
      .string()
      .required("Please enter your API key.")
      .min(10, "Please enter atleast 10 characters.")
      .max(maxAPILength, `You can enter only ${maxAPILength} characters.`),
    secretkey: yup
      .string()
      .required("Please enter your secret key.")
      .min(10, "Please enter atleast 10 characters.")
      .max(maxAPILength, `You can enter only ${maxAPILength} characters.`),
  });

  const getExchangeListHandler = async (token) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listExchanges",
      });
      if (response) {
        const filterFun = response.data.result;
        setExchangeList(filterFun);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getServerIPHandler = async (token) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "serverIPAddress",
      });
      if (response) {
        setServerIPAddress(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectExchangeHandler = async (values, resetForm) => {
    try {
      setIsProcessing(true);
      const dataToSend = {
        _id: editExchangeData?._id || undefined,
        exchangeName: !editExchangeData ? values.exchnageType : undefined,
        apiKey: values.apikey,
        apiSecret: values.secretkey,
      };
      const response = await apiRouterCall({
        method: editExchangeData ? "PUT" : "POST",
        endPoint: editExchangeData ? "editExchanges" : "connectExchanges",
        bodyData: dataToSend,
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        resetForm();
        setExchangeType(0);
        auth.getConnectedExchangeList();
        setEditExchangeData();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    getExchangeListHandler();
    getServerIPHandler();
  }, []);

  useEffect(() => {
    if (editExchangeData?.exchangeName) {
      setExchangeType(editExchangeData?.exchangeName);
    } else {
      setExchangeType(0);
    }
  }, [editExchangeData?.exchangeName]);
  return (
    <Paper elevation={2}>
      <Box style={{ paddingRight: "20px" }}>
        <Typography variant="h5" color="primary">
          Binding
        </Typography>
        <Formik
          enableReinitialize
          initialValues={formInitialSchema}
          initialStatus={{
            success: false,
            successMsg: "",
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values, { resetForm }) => {
            connectExchangeHandler(values, resetForm);
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
            setFieldValue,
          }) => (
            <Form>
              <Box mt={2}>
                <Typography
                  variant="body2"
                  color="secondary"
                  style={{ marginBottom: "5px" }}
                >
                  Choose Your exchange{" "}
                  <span style={{ color: "#FD3124" }}>*</span>
                </Typography>

                <FormControl
                  variant="standard"
                  fullWidth
                  className="formControl"
                >
                  <Select
                    name="exchnageType"
                    variant="outlined"
                    value={exchnageType}
                    MenuProps={MenuProps}
                    error={Boolean(touched.exchnageType && errors.exchnageType)}
                    onBlur={handleBlur}
                    disabled={isProcessing || editExchangeData}
                    onChange={(e) => {
                      handleChange(e);
                      setExchangeType(e.target.value);
                    }}
                    fullWidth
                  >
                    {exchangeList &&
                      funConEx(exchangeList)?.map((map, i) => {
                        return (
                          <MenuItem value={map?.uid}>
                            <Box
                              value={map?.uid}
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={map?.img}
                                alt={map?.exchangeName}
                                style={{
                                  borderRadius: "50%",
                                  height: "20px",
                                  width: "20px",
                                }}
                              />

                              <span style={{ padding: "0 0 0 10px" }}>
                                {map?.exchangeName}
                              </span>
                            </Box>
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <FormHelperText error className={"classes.helperText"}>
                  {touched.exchnageType && errors.exchnageType}
                </FormHelperText>
              </Box>

              <Box mt={2}>
                <Typography
                  variant="body2"
                  color="secondary"
                  style={{ marginBottom: "5px" }}
                >
                  Api key <span style={{ color: "#FD3124" }}>*</span>
                </Typography>
                <TextField
                  name="apikey"
                  variant="outlined"
                  value={values.apikey}
                  placeholder="Enter api key"
                  fullWidth
                  error={Boolean(touched.apikey && errors.apikey)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                <FormHelperText error>
                  {touched.apikey && errors.apikey}
                </FormHelperText>
              </Box>

              <Box mt={2}>
                <Typography
                  variant="body2"
                  color="secondary"
                  style={{ marginBottom: "5px" }}
                >
                  Secret key <span style={{ color: "#FD3124" }}>*</span>
                </Typography>
                <TextField
                  name="secretkey"
                  variant="outlined"
                  placeholder="Enter secret key"
                  value={values.secretkey}
                  fullWidth
                  error={Boolean(touched.secretkey && errors.secretkey)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                <FormHelperText error>
                  {touched.secretkey && errors.secretkey}
                </FormHelperText>
              </Box>
              <Box mt={2}>
                <Box
                  className="displayCenter"
                  onClick={() => !isProcessing && setIsRemember(!isRemember)}
                  style={{ alignItems: "start" }}
                >
                  <Box>
                    <Checkbox
                      style={{ color: "#475569" }}
                      checked={isRemember}
                      disabled={isProcessing}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="secondary"
                      style={{ cursor: "pointer", marginTop: "2px" }}
                    >
                      I acknowledge that by providing my exchange API. I
                      authorise Copywing platform to access my account for trade
                      execution. I accept role and responsibility for keeping my
                      API credentials secure.
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isProcessing || !isRemember}
                >
                  {editExchangeData ? "Update" : "Add"} Exchange
                  {isProcessing && <ButtonCircularProgress />}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Box className="serverBox" mt={2}>
          <Typography variant="body2" color="primary" mb={1.9}>
            Server IP Address is <br />
            {[
              "3.6.199.100",
              "52.66.138.115",
              "3.7.185.199",
              "3.111.191.121",
              "3.108.135.37",
            ].map((ip, i) => (
              <span>
                {ip}
                {ip && (
                  <CopyToClipboard text={ip}>
                    <IconButton
                      aria-label="Copy"
                      onClick={() => toast.success("Copied")}
                    >
                      <LuCopy
                        style={{
                          cursor: "pointer",
                          color: "#11D9EF",
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </CopyToClipboard>
                )}
              </span>
            ))}
          </Typography>
          <Typography variant="body2" color="primary">
            Please whitelist the IP address above in your exchange settings
            before attempting to connect.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ConnectExchangeBox;
