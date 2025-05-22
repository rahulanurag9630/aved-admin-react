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
import { Formik, Form } from "formik";
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
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;
  const addFaq = location?.state?.addFaq;
  const editFaq = location?.state?.editFaq;

  // Separate refs for each editor
  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);

  const validationSchema = yup.object({
    title_en: addFaq || editFaq
      ? yup
        .string()
        .trim()
        .required("Question in English is required.")
        .max(256, "Question should not exceed 256 characters.")
      : yup
        .string()
        .trim()
        .required("Title is required.")
        .max(256, "Title should not exceed 256 characters."),
    title_ar: addFaq || editFaq
      ? yup
        .string()
        .trim()
        .required("Question in Arabic is required.")
        .max(256, "Question should not exceed 256 characters.")
      : yup.string().trim(),
    description_en: yup
      .string()
      .trim()
      .required(`${addFaq || editFaq ? "Answer in English" : "Description"} is required.`),
    description_ar: addFaq || editFaq
      ? yup
        .string()
        .trim()
        .required("Answer in Arabic is required.")
      : yup.string().trim(),
  });

  const handleStatic = async (values) => {
    try {
      setIsLoading(true);
      const response = await apiRouterCall({
        method: addFaq ? "POST" : "PUT",
        endPoint: addFaq ? "addFAQ" : editFaq ? "editFAQ" : "editStaticContent",
        bodyData: {
          _id: !addFaq ? location?.state?._id : undefined,
          question_en: addFaq || editFaq ? values.title_en : undefined,
          question_ar: addFaq || editFaq ? values.title_ar : undefined,
          title: !(addFaq || editFaq) ? values.title_en : undefined,
          answer_en: addFaq || editFaq ? values.description_en : undefined,
          answer_ar: addFaq || editFaq ? values.description_ar : undefined,
          description: !(addFaq || editFaq) ? values.description_en : undefined,
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
      toast.error("An error occurred while saving.");
    }
  };

  return (
    <Box className={classes.editprofileBox}>
      <Topheading
        heading={
          addFaq || editFaq
            ? `${editFaq ? "Edit" : "Add"} FAQ`
            : `${isView ? "View" : "Edit"} Static Content`
        }
      />
      <Formik
        enableReinitialize
        initialValues={{
          title_en: location?.state?.title || location?.state?.question_en || "",
          title_ar: location?.state?.question_ar || "",
          description_en: location?.state?.description || location?.state?.answer_en || "",
          description_ar: location?.state?.answer_ar || "",
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
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {addFaq || editFaq ? (
                <Grid container spacing={2}>
                  {/* English Question */}
                  <Grid item xs={12} sm={6}>
                    <Box mt={1} mb={1}>
                      <Typography variant="body2">Question (English)</Typography>
                    </Box>
                    <FormControl fullWidth className="formControl">
                      <TextField
                        variant="outlined"
                        placeholder="Enter question in English"
                        fullWidth
                        name="title_en"
                        value={values.title_en}
                        disabled={isEdit || isView || isLoading}
                        error={Boolean(touched.title_en && errors.title_en)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <FormHelperText error>
                        {touched.title_en && errors.title_en}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* Arabic Question */}
                  <Grid item xs={12} sm={6}>
                    <Box mt={1} mb={1} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">السؤال (العربية)</Typography>
                    </Box>
                    <FormControl fullWidth className="formControl">
                      <TextField
                        variant="outlined"
                        placeholder="أدخل السؤال بالعربية"
                        fullWidth
                        name="title_ar"
                        value={values.title_ar}
                        disabled={isEdit || isView || isLoading}
                        error={Boolean(touched.title_ar && errors.title_ar)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{ style: { textAlign: "right" }, dir: "rtl" }}
                      />
                      <FormHelperText error>
                        {touched.title_ar && errors.title_ar}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">Title</Typography>
                  </Box>
                  <FormControl fullWidth className="formControl">
                    <TextField
                      variant="outlined"
                      placeholder="Title of static content"
                      fullWidth
                      name="title_en"
                      value={values.title_en}
                      disabled={isEdit || isView || isLoading}
                      error={Boolean(touched.title_en && errors.title_en)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <FormHelperText error>
                      {touched.title_en && errors.title_en}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              )}

              <Grid container spacing={2}>
                {/* English Description/Answer */}
                <Grid item xs={12} sm={6}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">
                      {addFaq || editFaq ? "Answer (English)" : "Description"}
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    className="formControl"
                    error={touched.description_en && Boolean(errors.description_en)}
                  >
                    <JoditEditor
                      ref={editorRefEn}
                      value={values.description_en}
                      tabIndex={1}
                      config={{
                        readonly: isView || isLoading,
                        toolbar: true,

                      }}
                      onBlur={(newContent) => setFieldValue("description_en", newContent)}
                    />
                    <FormHelperText error>
                      {touched.description_en && errors.description_en}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* Arabic Description/Answer */}
                <Grid item xs={12} sm={6}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2" dir="rtl">
                      {addFaq || editFaq ? "الإجابة (العربية)" : "الوصف (العربية)"}
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    className="formControl"
                    error={touched.description_ar && Boolean(errors.description_ar)}
                  >
                    <JoditEditor
                      ref={editorRefAr}
                      value={values.description_ar}
                      tabIndex={2}

                      config={{
                        readonly: isView || isLoading,
                        toolbar: true,
                        direction: "rtl",
                        language: "ar",

                      }}
                      onBlur={(newContent) => setFieldValue("description_ar", newContent)}
                    />
                    <FormHelperText error>
                      {touched.description_ar && errors.description_ar}
                    </FormHelperText>
                  </FormControl>
                </Grid>
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
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      Update {isLoading && <ButtonCircularProgress />}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
}