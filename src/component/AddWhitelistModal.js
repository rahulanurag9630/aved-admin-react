import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
  TextField,
  FormHelperText,
  Paper,
  Select,
  MenuItem,
} from "@material-ui/core";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ButtonCircularProgress from "./ButtonCircularProgress";
import { Formik, Form } from "formik";
import * as yep from "yup";
import toast from "react-hot-toast";
import { apiRouterCall } from "src/ApiConfig/service";
import { MenuProps, validateAccountAddress } from "src/utils";

const useStyles = makeStyles(() => ({
  IconBox: {
    position: "absolute",
    right: "0",
  },
  cancelBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    "&::hover": {
      background: "transparent",
    },
    "& svg": {
      color: "#fff",
      fontWeight: "700",
      background: "transparent",
    },
  },
  dialougTitle: {
    "& .subTextWallet": {
      maxWidth: "100%",
      marginTop: "20px",
    },
  },
}));
export default function AddWhitelistModal({
  openModal,
  handleClose,
  callBack,
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const formInitialSchema = {
    poolName: "Select Pool",
    name: "",
    walletAddress: "",
  };

  const formValidationSchema = yep.object().shape({
    poolName: yep.string().notOneOf(["Select Pool"], "Pool name is required."),
    name: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("Name is required.")
      .matches(
        /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/g,
        "Please enter name."
      ),
    walletAddress: yep
      .string()
      .trim()
      .required("Wallet address is required.")
      .test(
        "validate-address",
        "Please enter a valid wallet address.",
        (value) => {
          return !value || validateAccountAddress(value);
        }
      ),
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: "POST",
        endPoint: "addWhiteListedAddress",
        bodyData: {
          poolName: values.poolName,
          userName: values.name,
          walletAddress: values.walletAddress,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        handleClose();
        callBack();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        className={classes.dailogOpen}
        open={openModal}
        keepMounted
        onClose={() => !isLoading && handleClose()}
      >
        <DialogTitle className="dislogTitleBox">
          <IconButton
            disabled={isLoading}
            onClick={() => handleClose()}
            className="closeButton"
          >
            <RxCross2 />
          </IconButton>
        </DialogTitle>

        <DialogContent style={{ paddingBottom: "0px" }}>
          <Box className={classes.dialougTitle} align="center">
            <Typography className="ubuntu" variant="h4" color="primary">
              Whitelist Address
            </Typography>
          </Box>
          <Formik
            enableReinitialize
            initialValues={formInitialSchema}
            validationSchema={formValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form>
                <Paper elevation={2}>
                  <Box mb={1}>
                    <Typography variant="body2" color="primary">
                      Select Pool <span style={{ color: "#EB5A2C" }}>*</span>
                    </Typography>
                  </Box>
                  <Select
                    variant="outlined"
                    name="poolName"
                    error={Boolean(touched.poolName && errors.poolName)}
                    onBlur={handleBlur}
                    value={values?.poolName}
                    onChange={handleChange}
                    MenuProps={MenuProps}
                    disabled={isLoading}
                  >
                    <MenuItem value="Select Pool" disabled>
                      Select Pool
                    </MenuItem>
                    <MenuItem value="SALES_MANAGER">Sales Manager</MenuItem>
                    <MenuItem value="SALES_DIRECTOR">Sales Director</MenuItem>
                    <MenuItem value="GROUP_VICE_PRESIDENT">
                      Group Vice President
                    </MenuItem>
                  </Select>
                  <FormHelperText error>
                    {touched?.country && errors?.country}
                  </FormHelperText>
                  <Box mt={2} mb={1}>
                    <Typography variant="body2" color="primary">
                      Full Name <span style={{ color: "#EB5A2C" }}>*</span>
                    </Typography>
                  </Box>
                  <TextField
                    variant="outlined"
                    placeholder="Please enter name"
                    fullWidth
                    name="name"
                    value={values.name}
                    error={Boolean(touched?.name && errors?.name)}
                    onBlur={handleBlur}
                    onChange={(e) =>
                      e.target.value.length <= 33 && handleChange(e)
                    }
                    disabled={isLoading}
                  />
                  <FormHelperText error>
                    {touched?.name && errors?.name}
                  </FormHelperText>

                  <Box mt={2} mb={1}>
                    <Typography variant="body2" color="primary">
                      Wallet Address <span style={{ color: "#EB5A2C" }}>*</span>
                    </Typography>
                  </Box>
                  <TextField
                    variant="outlined"
                    placeholder="Please enter wallet address"
                    fullWidth
                    name="walletAddress"
                    value={values.walletAddress}
                    error={Boolean(
                      touched?.walletAddress && errors?.walletAddress
                    )}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <FormHelperText error>
                    {touched?.walletAddress && errors?.walletAddress}
                  </FormHelperText>

                  <Box className="displayCenter" my={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ minWidth: "186px" }}
                      disabled={isLoading}
                    >
                      Submit
                      {isLoading && <ButtonCircularProgress />}
                    </Button>
                  </Box>
                </Paper>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
