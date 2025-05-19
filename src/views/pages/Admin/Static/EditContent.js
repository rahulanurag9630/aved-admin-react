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


  // Separate refs for each editor
  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);
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
              {addFaq ? (
                <Grid container spacing={2}>
                  {/* English Question (Left) */}
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
                        error={Boolean(touched?.title_en && errors?.title_en)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <FormHelperText error>
                        {touched?.title_en && errors?.title_en}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Arabic Question (Right) */}
                  <Grid item xs={12} sm={6}>
                    <Box mt={1} mb={1} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">السؤال</Typography>
                    </Box>
                    <FormControl fullWidth className="formControl">
                      <TextField
                        variant="outlined"
                        placeholder="أدخل السؤال بالعربية"
                        fullWidth
                        name="title_ar"
                        value={values.title_ar}
                        disabled={isEdit || isView || isLoading}
                        error={Boolean(touched?.title_ar && errors?.title_ar)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{ style: { textAlign: 'right' }, dir: 'rtl' }}
                      />
                      <FormHelperText error>
                        {touched?.title_ar && errors?.title_ar}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                // If not addFaq, show single Title field (default behavior)
                <Grid item xs={12}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">Title</Typography>
                  </Box>
                  <FormControl fullWidth className="formControl">
                    <TextField
                      variant="outlined"
                      placeholder="Title of static content"
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
              )}


              <Grid container spacing={2}>
                {/* English / Default Description */}
                <Grid item xs={6}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">
                      {addFaq || editFaq ? "Answer (English)" : "Description"}
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
                        iframe: true, // Enables isolated styling
                        iframeStyle: `
            * { color: black !important; }
            body { background-color: white; color: black !important; }
          `,
                      }}
                      name="description"
                      onBlur={(e) => setFieldValue("description", e)}
                    />

                    {touched.description && (
                      <FormHelperText>{errors.description}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Arabic / RTL Description */}
               
                  <Grid item xs={6}>
                    <Box mt={1} mb={1} textAlign="right">
                      <Typography variant="body2">السؤال (Arabic)</Typography>
                    </Box>

                    <FormControl
                      fullWidth
                      className="formControl"
                      error={touched.description_ar && Boolean(errors.description_ar)}
                    >
                      <JoditEditor
                        ref={(instance) => (editorRefAr.current = instance)}
                        value={values.description_ar}
                        tabIndex={2}
                        config={{
                          readonly: isView || isLoading,
                          toolbar: true,
                          direction: "rtl",
                          language: "ar",
                          iframe: true,
                          autofocus: false,
                          iframeStyle: `
              * { color: black !important; direction: rtl !important; }
              body { background-color: white; color: black !important; direction: rtl; }
            `,
                        }}
                        name="description_ar"
                        onBlur={(e) => setFieldValue("description_ar", e)}
                      />
                      {touched.description_ar && (
                        <FormHelperText>{errors.description_ar}</FormHelperText>
                      )}
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
