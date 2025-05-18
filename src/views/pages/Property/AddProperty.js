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
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import { getBase64 } from "src/utils";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    padding: theme.spacing(4),
  },
  imageUploadBox: {
    border: "2px dashed #FFFFFF26",
    padding: theme.spacing(2),
    borderRadius: "10px",
    textAlign: "center",
  },
  previewImage: {
    height: "120px",
    width: "120px",
    borderRadius: "10px",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  propertyName: yup.string().required("Property Name is required"),
  apartmentNumber: yup.string().required("Apartment Number is required"),
  propertyType: yup.string().required("Property Type is required"),
  address: yup.string().required("Address is required"),
  latitude: yup.string().required("Latitude is required"),
  longitude: yup.string().required("Longitude is required"),
  area: yup.number().required("Area is required"),
  overview: yup.string().required("Overview is required"),
  noOfFloors: yup.number().required("Number of floors is required"),
  noOfBedrooms: yup.number().required("Number of bedrooms is required"),
  noOfBathrooms: yup.number().required("Number of bathrooms is required"),
  yearBuilt: yup.number().required("Year of built is required"),
  price: yup.number().required("Price is required"),
});

const propertyTypes = ["Apartment", "Villa", "Studio"];
const amenitiesOptions = ["Gym", "Swimming Pool", "Parking"];
const tagOptions = ["For Sale", "For Rent", "New Launch"];

const AddProperty = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    propertyName: "",
    apartmentNumber: "",
    propertyType: "",
    address: "",
    latitude: "",
    longitude: "",
    area: "",
    overview: "",
    images: [],
    noOfFloors: 0,
    floorPlans: [],
    noOfBedrooms: 0,
    noOfBathrooms: 0,
    yearBuilt: "",
    price: "",
    amenities: [],
    tags: [],
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);
    setIsSubmitting(false);
  };

  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <Typography variant="h6" color="secondary" gutterBottom>
        Add New Property
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Property Name */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Property Name</Typography>
                <TextField fullWidth name="propertyName" variant="outlined" value={values.propertyName} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.propertyName && errors.propertyName)} />
                <FormHelperText error>{touched.propertyName && errors.propertyName}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir='rtl'>اسم العقار</Typography>
                <TextField fullWidth name="propertyName" variant="outlined" value={values.propertyName} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.propertyName && errors.propertyName)} />
                <FormHelperText error>{touched.propertyName && errors.propertyName}</FormHelperText>
              </Grid>

              {/* Apartment Number */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Apartment Number</Typography>
                <TextField fullWidth name="apartmentNumber" variant="outlined" value={values.apartmentNumber} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.apartmentNumber && errors.apartmentNumber)} />
                <FormHelperText error>{touched.apartmentNumber && errors.apartmentNumber}</FormHelperText>
              </Grid>

              {/* Property Type */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Property Type</Typography>
                <TextField select fullWidth name="propertyType" variant="outlined" value={values.propertyType} onChange={handleChange}>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.propertyType && errors.propertyType}</FormHelperText>
              </Grid>

              {/* Address */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Address</Typography>
                <TextField fullWidth name="address" variant="outlined" value={values.address} onChange={handleChange} />
                <FormHelperText error>{touched.address && errors.address}</FormHelperText>
              </Grid>

              {/* Latitude */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Latitude</Typography>
                <TextField fullWidth name="latitude" variant="outlined" value={values.latitude} onChange={handleChange} />
                <FormHelperText error>{touched.latitude && errors.latitude}</FormHelperText>
              </Grid>

              {/* Longitude */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Longitude</Typography>
                <TextField fullWidth name="longitude" variant="outlined" value={values.longitude} onChange={handleChange} />
                <FormHelperText error>{touched.longitude && errors.longitude}</FormHelperText>
              </Grid>

              {/* Area */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Area (sq ft)</Typography>
                <TextField fullWidth name="area" variant="outlined" value={values.area} onChange={handleChange} />
                <FormHelperText error>{touched.area && errors.area}</FormHelperText>
              </Grid>

              {/* Amenities */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Amenities</Typography>
                <TextField select fullWidth name="amenities" variant="outlined" multiple value={values.amenities} onChange={handleChange}>
                  {amenitiesOptions.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Overview */}
              <Grid item xs={12}>
                <Typography variant="body2" color="secondary">Overview</Typography>
                <TextField fullWidth multiline minRows={3} name="overview" variant="outlined" value={values.overview} onChange={handleChange} />
                <FormHelperText error>{touched.overview && errors.overview}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="secondary" dir="rtl">نظرة عامة</Typography>
                <TextField fullWidth multiline minRows={3} name="overview" variant="outlined" value={values.overview} onChange={handleChange} />
                <FormHelperText error>{touched.overview && errors.overview}</FormHelperText>
              </Grid>

              {/* Multiple Images Upload */}
              <Grid item xs={12}>
                <Box className={classes.imageUploadBox}>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      Promise.all(files.map((file) => new Promise((resolve) => getBase64(file, resolve))))
                        .then((base64Images) => {
                          setFieldValue("images", [...values.images, ...base64Images]);
                        });
                    }}

                  />
                  <label htmlFor="image-upload" className="displayCenter" style={{ flexDirection: "column" }}>
                    <Avatar><FiUpload /></Avatar>
                    <Typography variant="body2" style={{ marginTop: 8 }}>Click to upload images</Typography>
                  </label>
                  <Box display="flex" flexWrap="wrap" mt={2}>
                    {values.images.map((img, i) => (
                      <img key={i} src={img} alt="preview" className={classes.previewImage} />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* No of Floors */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">No of Floors</Typography>
                <TextField
                  fullWidth
                  name="noOfFloors"
                  type="number"
                  variant="outlined"
                  value={values.noOfFloors}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    handleChange(e);
                    // Clear extra images if the floor count decreases
                    if (!isNaN(num) && values.floorPlans.length > num) {
                      setFieldValue("floorPlans", values.floorPlans.slice(0, num));
                    }
                  }}
                  onBlur={handleBlur}
                  error={Boolean(touched.noOfFloors && errors.noOfFloors)}
                />
                <FormHelperText error>{touched.noOfFloors && errors.noOfFloors}</FormHelperText>
              </Grid>

              {/* Floor Plan Uploads */}
              <Grid item xs={12}>
                <Box className={classes.imageUploadBox}>
                  <input
                    id="floor-plan-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={values.floorPlans.length >= values.noOfFloors}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const availableSlots = values.noOfFloors - values.floorPlans.length;

                      const filesToUpload = files.slice(0, availableSlots);
                      Promise.all(
                        filesToUpload.map((file) => new Promise((resolve) => getBase64(file, resolve)))
                      ).then((base64Images) => {
                        setFieldValue("floorPlans", [...values.floorPlans, ...base64Images]);
                      });
                    }}
                  />
                  <label htmlFor="floor-plan-upload" className="displayCenter" style={{ flexDirection: "column", opacity: values.floorPlans.length >= values.noOfFloors ? 0.5 : 1, pointerEvents: values.floorPlans.length >= values.noOfFloors ? "none" : "auto" }}>
                    <Avatar><FiUpload /></Avatar>
                    <Typography variant="body2" style={{ marginTop: 8 }}>Click to upload Floor Plans</Typography>
                    {values.floorPlans.length >= values.noOfFloors && (
                      <FormHelperText error>You’ve uploaded all {values.noOfFloors} floor plans.</FormHelperText>
                    )}
                  </label>

                  <Box display="flex" flexWrap="wrap" mt={2}>
                    {values.floorPlans.map((img, i) => (
                      <img key={i} src={img} alt={`floor-${i + 1}`} className={classes.previewImage} />
                    ))}
                  </Box>
                </Box>
              </Grid>



              {/* Bedrooms */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">No of Bedrooms</Typography>
                <TextField fullWidth type="number" name="noOfBedrooms" variant="outlined" value={values.noOfBedrooms} onChange={handleChange} />
              </Grid>

              {/* Bathrooms */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">No of Bathrooms</Typography>
                <TextField fullWidth type="number" name="noOfBathrooms" variant="outlined" value={values.noOfBathrooms} onChange={handleChange} />
              </Grid>

              {/* Year Built */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Year of Built</Typography>
                <TextField fullWidth type="number" name="yearBuilt" variant="outlined" value={values.yearBuilt} onChange={handleChange} />
              </Grid>

              {/* Tags */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Tags</Typography>
                <TextField select fullWidth name="tags" variant="outlined" multiple value={values.tags} onChange={handleChange}>
                  {tagOptions.map((tag) => (
                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Price */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Price</Typography>
                <TextField fullWidth name="price" variant="outlined" type="number" value={values.price} onChange={handleChange} />
              </Grid>

              {/* Submit Button */}

              <Grid item xs={12} className="displayCenter">
                <Button variant="contained"
                  color="secondary"
                  className="filterButtonCustom" type="submit" onClick={() => { window.history.back() }}>
                  {isSubmitting ? "Submitting..." : "Back"}
                </Button>&nbsp;&nbsp;&nbsp;
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddProperty;
