import {
  Avatar,
  Box,
  Grid,
  makeStyles,
  Typography,
  TextField,
  Button,
  Paper,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";
import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import uploadFile, { getBase64 } from "src/utils";
import toast from "react-hot-toast";
import { apiRouterCall } from "../../../ApiConfig/service";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    padding: theme.spacing(4),
  },
  imageUploadBox: {
    border: "2px dashed #000",
    padding: theme.spacing(2),
    borderRadius: "10px",
    textAlign: "center",
  },
  previewImage: {
    height: "120px",
    width: "120px",
    borderRadius: "10px",
    marginTop: theme.spacing(2),
  },
}));

const validationSchema = yup.object().shape({
  title: yup.string().required("Please enter title.").min(3, "Enter at least 3 characters"),
  description: yup.string().required("Please enter description.").min(10, "Enter at least 10 characters"),
  description_arb: yup
    .string()
    .required("يرجى إدخال الوصف.")
    .min(10, "أدخل 10 أحرف على الأقل."),

  image: yup.string().required("Please upload an image."),
  title_ar: yup
    .string()
    .required("يرجى إدخال العنوان.")
    .min(3, "أدخل 3 أحرف على الأقل."),

  image_ar: yup
    .string()
    .required("يرجى تحميل صورة."),


});

const AddBlog = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);


  const initialValues = {
    title: "",
    title_ar: "",
    description: "",
    description_arb: "",
    image: "",
    image_ar: "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("Blog data submitted:", values);

    try {
      setIsLoading(true);

      const bodyData = {
        id: values.id || undefined, // for update
        title: values.title,
        title_ar: values.title_ar,
        description: values.description, // fixed
        description_ar: values.description_arb, // fixed
        image: values.image,
        image_ar: values.image_ar, // fixed: separate field
      };

      const res = await apiRouterCall({
        method: "POST",
        endPoint: "addOrUpdateBlog",
        bodyData,
      });

      console.log("Blog API response:", res);

      if (res?.data?.responseCode === 200) {

        if (values.id) {
          toast.success("Blog updated successfully.");
        } else {
          toast.success("Blog added successfully.");
        }
       
      } else {
        toast.error(res?.data?.responseMessage || "Something went wrong.");
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Blog add/update error:", err);
      toast.error("Server error. Please try again.");
    }

    setIsSubmitting(false);
  };

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;

  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);
  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <Typography variant="h6" color="secondary" gutterBottom>
        Add New Blog
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {/* Title */}
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                    Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter title"
                    name="title"
                    variant="outlined"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.title && errors.title)}
                  />
                  <FormHelperText error>{touched.title && errors.title}</FormHelperText>
                </Grid>

                {/* Title */}
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" dir='rtl' style={{ marginBottom: "5px" }}>
                    العنوان
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="أدخل العنوان"
                    dir='rtl'
                    name="title_ar"
                    variant="outlined"
                    value={values.title_ar}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.title_ar && errors.title_ar)}
                  />
                  <FormHelperText error>{touched.title_ar && errors.title_ar}</FormHelperText>
                </Grid>
              </Grid>

              {/* Description */}

              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                    Description
                  </Typography>


                  <JoditEditor
                    ref={editorRefEn}
                    value={values.description}
                    tabIndex={1}
                    name="description"
                    variant="outlined"
                    config={{
                      readonly: isView || isLoading,
                      toolbar: true,

                    }}
                    error={Boolean(touched.description && errors.description)}
                    onBlur={(newContent) => setFieldValue("description", newContent)}
                  />

                  <FormHelperText error>{touched.description && errors.description}</FormHelperText>
                </Grid>
                {/* Description */}
                <Grid item xs={6}>
                  <Typography variant="body2" dir='rtl' color="secondary" style={{ marginBottom: "5px" }}>
                    الوصف
                  </Typography>

                  <JoditEditor
                    ref={editorRefAr}
                    value={values.description_ar}
                    tabIndex={2}
                    name="description_arb"
                    config={{
                      readonly: isView || isLoading,
                      toolbar: true,
                      direction: "rtl",
                      language: "ar",

                    }}
                    error={Boolean(touched.description_arb && errors.description_arb)}

                    onBlur={(newContent) => setFieldValue("description_arb", newContent)}
                  />


                  <FormHelperText error>{touched.description_arb && errors.description_arb}</FormHelperText>
                </Grid>

              </Grid>

              {/* Image Upload */}


              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                    Image
                  </Typography>
                  <Box className={classes.imageUploadBox}>
                    <input
                      id="image-upload-en"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            setLoading(true);
                            const url = await uploadFile(file, setLoading);
                            if (url) {
                              setFieldValue("image", url);
                            }
                          } catch (err) {
                            toast.error("Image upload failed!");
                          }
                        }
                      }}
                    />
                    <label htmlFor="image-upload-en" className="displayCenter" style={{ flexDirection: "column" }}>
                      <Avatar>
                        <FiUpload color="#FFF" />
                      </Avatar>
                      <Typography variant="body2" style={{ marginTop: 8, textAlign: "center", color: "#fff" }}>
                        Click to upload image
                      </Typography>
                    </label>

                    {values.image && (
                      <img src={values.image} alt="Preview" className={classes.previewImage} />
                    )}

                    <FormHelperText error>{touched.image && errors.image}</FormHelperText>
                  </Box>
                </Grid>

                {/* Image */}
                <Grid item xs={6}>
                  <Typography variant="body2" dir='rtl' color="secondary" style={{ marginBottom: "5px" }}>
                    الصورة
                  </Typography>
                  <Box className={classes.imageUploadBox}>
                    {/* Arabic Image Upload */}
                    <input
                      id="image-upload-ar"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            setLoading(true);
                            const url = await uploadFile(file, setLoading);
                            if (url) {
                              setFieldValue("image_ar", url);
                            }
                          } catch (err) {
                            toast.error("Image upload failed!");
                          }
                        }
                      }}

                    />
                    <label htmlFor="image-upload-ar" className="displayCenter" style={{ flexDirection: "column" }}>
                      <Avatar>
                        <FiUpload color="#FFF" />
                      </Avatar>
                      <Typography
                        variant="body2"
                        style={{ marginTop: 8, textAlign: "center", color: "#fff" }}
                      >
                        اضغط لتحميل الصورة
                      </Typography>
                    </label>


                    {values.image_ar && (
                      <img src={values.image_ar} alt="معاينة" className={classes.previewImage} />
                    )}

                    <FormHelperText error>{touched.image_ar && errors.image_ar}</FormHelperText>
                  </Box>
                </Grid>


              </Grid>


              {/* Submit Button */}

              <Grid item xs={7}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Back Button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </Button>

                  {/* Submit Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </Grid>


            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddBlog;
