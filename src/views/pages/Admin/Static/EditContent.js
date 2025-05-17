import {
  Avatar,
  Box,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import React, { useRef, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import Topheading from "src/component/TopHeading";
import { apiRouterCall } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import toast from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  editprofileBox: {
    position: "relative",
    zIndex: "999",
    "& .displaySpacebetween": {
      paddingBottom: "20px",
    },
    "& .formBox": {
      maxWidth: "650px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "100%",
      },
    },
    "& p": {
      textAlign: "left",
      color: "#ffffff8c",
    },
  },
  imgsection: {
    height: "150px",
    width: "150px",
    borderRadius: "100px",
  },
  upload: {
    top: "-37px",
    right: "-50px",
    cursor: "pointer",
    position: "relative",
    borderRadius: "50px",
    "& .editicon": {
      "& svg": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "27px",
      },
    },
    "& .MuiAvatar-root": {
      background: "transparent",
      cursor: "pointer",
    },
  },
}));

export default function EditProfile() {
  const classes = useStyles();
  const history = useHistory();
  const editor = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;
  const addFaq = location?.state?.addFaq;
  const editFaq = location?.state?.editFaq;

  const validationSchema = yup.object({
    title:
      addFaq || editFaq
        ? yup
            .string()
            .trim()
            .required("Question is required.")
            .max(256, "Question should not exceed 256 characters.")
        : "",
    description: yup
      .string()
      .trim()
      .required(`${addFaq || editFaq ? "Answer" : "Description"} is required.`),
  });

  const handleStatic = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: addFaq ? "POST" : "PUT",
        endPoint: addFaq ? "addFAQ" : editFaq ? "editFAQ" : "editStaticContent",

        bodyData: {
          _id: !addFaq ? location?.state?._id : undefined,
          [addFaq || editFaq ? "question" : "title"]: values.title,
          [addFaq || editFaq ? "answer" : "description"]: values.description,
        },
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
        history.goBack();
      } else {
        toast.error(response?.data?.responseMessage);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Box className={classes.viewcontentBox}>
      <Topheading
        heading={
          addFaq || editFaq
            ? `${editFaq ? "Edit" : "Add"} Faq`
            : `${isView ? "View" : "Edit"} Static Content`
        }
      />
      <Formik
        enableReinitialize
        initialValues={{
          title: location?.state?.title || "",
          description: location?.state?.description || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleStatic}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box mt={1} mb={1}>
                  <Typography variant="body2">
                    {addFaq || editFaq ? "Question" : "Title"}{" "}
                  </Typography>
                </Box>

                <FormControl fullWidth className="formControl">
                  <TextField
                    variant="outlined"
                    placeholder={
                      addFaq || editFaq
                        ? "Enter question"
                        : `Title of static content`
                    }
                    fullWidth
                    name="title"
                    value={values.title}
                    disabled={isEdit || isView || isLoading}
                    error={Boolean(touched?.title && errors?.title)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <FormHelperText error>
                    {touched?.title && errors?.title}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box mt={1} mb={1}>
                  <Typography variant="body2">
                    {addFaq || editFaq ? "Answer" : "Description"}
                  </Typography>
                </Box>

                <FormControl
                  fullWidth
                  className="formControl"
                  error={touched.description && Boolean(errors.description)}
                >
                  <JoditEditor
                    ref={editor}
                    value={values.description}
                    tabIndex={1}
                    config={{
                      readonly: isView || isLoading,
                      toolbar: true,
                    }}
                    name="description"
                    onBlur={(e) => setFieldValue("description", e)}
                  />
                  {touched.description && (
                    <FormHelperText>{errors.description}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box className="displayCenter" mt={4}>
                  <Button
                    variant="contained"
                    className="transparentbutton"
                    color="secondary"
                    onClick={() => history.goBack()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  {!isView && (
                    <>
                      &nbsp; &nbsp;
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        Update {isLoading && <ButtonCircularProgress />}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
}
