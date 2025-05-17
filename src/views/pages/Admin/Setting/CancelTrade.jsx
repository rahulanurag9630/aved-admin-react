import {
  Box,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
  Paper,
  FormHelperText,
} from "@material-ui/core";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as yep from "yup";
import { apiRouterCall } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const formValidationSchema = yep.object().shape({
  coinName: yep.string().trim().required("Coin name is required."),
  // .matches(/^rewired$/i, "Coin name must be 'rewired' (case-insensitive)."),
});

const useStyles = makeStyles((theme) => ({
  changeprofileBox: {
    position: "relative",
    zIndex: "999",
    "& .displaySpacebetween": {
      paddingBottom: "20px",
    },

    "& p": {
      textAlign: "left",
    },
  },
}));

export default function CancelTrade({ tabs }) {
  const classes = useStyles();
  const [isUpdating, setIsUpdating] = useState(false);

  const formInitialSchema = {
    coinName: "",
  };
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: "PUT",
        endPoint: tabs == "1" ? "closeOpenOrdersAll" : "closePositionAllNew",
        bodyData: {
          coinName: values.coinName,
        },
      });
      if (response.data.responseCode === 200) {
        resetForm();
        toast.success(response.data.responseMessage);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.changeprofileBox}>
      <Box>
        <Paper elevation={2}>
          <Box mb={3}>
            <Typography variant="h3" color="primary">
              {tabs == "1" ? "Close Open Orders" : "Close Position"}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {" "}
              <Formik
                key={tabs} // Forces component remount on tab change
                initialValues={formInitialSchema}
                validationSchema={formValidationSchema}
                onSubmit={(values, actions) => handleSubmit(values, actions)}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  errors,
                  touched,
                  setFieldValue,
                  resetForm, // Add resetForm to the destructured props
                }) => (
                  <Form>
                    <Box mt={2} mb={1}>
                      <Typography variant="body2" color="primary">
                        Coin Name <span style={{ color: "#EB5A2C" }}>*</span>
                      </Typography>
                    </Box>
                    <TextField
                      type="text"
                      variant="outlined"
                      placeholder="Enter coin"
                      fullWidth
                      name="coinName"
                      value={values.coinName}
                      error={Boolean(touched?.coinName && errors?.coinName)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={isUpdating}
                    />
                    <FormHelperText error>
                      {touched?.coinName && errors?.coinName}
                    </FormHelperText>
                    <Box className="displayStart" mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ minWidth: "186px" }}
                        disabled={isUpdating}
                      >
                        Submit
                        {isUpdating && <ButtonCircularProgress />}
                      </Button>
                    </Box>{" "}
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
