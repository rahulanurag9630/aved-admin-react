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
import React, { useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload } from "react-icons/fi";
import { getBase64 } from "src/utils";
import JoditEditor from "jodit-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

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
    marginRight: theme.spacing(1),
  },
}));

const validationSchema = yup.object().shape({
  propertyName: yup
    .string()
    .required("Property name is required")
    .min(3, "Property name must be at least 3 characters"),

  propertyName_ar: yup
    .string()
    .required("Property name (Arabic) is required")
    .min(3, "Property name (Arabic) must be at least 3 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  description_ar: yup
    .string()
    .required("Description (Arabic) is required")
    .min(10, "Description (Arabic) must be at least 10 characters"),

  detailDescription: yup
    .string()
    .required("Detailed description is required")
    .min(20, "Detailed description must be at least 20 characters"),

  detailDescription_ar: yup
    .string()
    .required("Detailed description (Arabic) is required")
    .min(20, "Detailed description (Arabic) must be at least 20 characters"),

  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be a positive number"),

  apartmentNumber: yup
    .string()
    .required("Apartment number is required")
    .matches(/^[a-zA-Z0-9\- ]+$/, "Apartment number can only contain letters, numbers, hyphens, and spaces"),

  noOfBedrooms: yup
    .number()
    .required("Number of bedrooms is required")
    .min(0, "Number of bedrooms cannot be negative"),

  noOfBathrooms: yup
    .number()
    .required("Number of bathrooms is required")
    .min(0, "Number of bathrooms cannot be negative"),

  yearBuilt: yup
    .number()
    .required("Year built is required")
    .min(1800, "Year built must be after 1800")
    .max(new Date().getFullYear(), `Year built cannot be in the future`),

  amenities: yup
    .array()
    .of(yup.string())
    .nullable()
    .default([]),

  area: yup
    .number()
    .required("Area is required")
    .min(0, "Area must be a positive number"),

  parkingSpace: yup
    .string()
    .oneOf(["Yes", "No"], "Parking space must be either 'Yes' or 'No'")
    .required("Parking space selection is required"),

  propertyType: yup
    .string()
    .required("Property type is required")
    .min(3, "Property type must be at least 3 characters"),

  listingType: yup
    .string()
    .required("Listing type is required")
    .oneOf(["Sale", "Rent"], "Listing type must be either 'Sale' or 'Rent'"),

  availabilityStatus: yup
    .string()
    .required("Availability status is required")
    .oneOf(["Available", "Sold", "Pending"], "Invalid availability status"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(["Active", "Inactive"], "Status must be either 'Active' or 'Inactive'"),

  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),

  latitude: yup
    .string()
    .required("Latitude is required")
    .matches(
      /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/,
      "Invalid latitude format"
    ),

  longitude: yup
    .string()
    .required("Longitude is required")
    .matches(
      /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?|180(\.0+)?/,
      "Invalid longitude format"
    ),

  images: yup
    .array()
    .of(yup.mixed().required("Image is required"))
    .min(1, "At least one image is required")
    .required("Images are required"),

  noOfFloors: yup
    .number()
    .required("Number of floors is required")
    .min(0, "Number of floors cannot be negative"),

  floorPlans: yup
    .array()
    .of(yup.mixed().required("Floor plan image is required"))
    .nullable()
    .default([]),

  metaTitle: yup
    .string()
    .required("Meta title is required")
    .min(3, "Meta title must be at least 3 characters"),

  metaTags: yup
    .string()
    .required("Meta tags are required")
    .min(3, "Meta tags must be at least 3 characters"),
});
const propertyTypes = ["Apartment", "Villa", "Studio"];
const amenitiesOptions = ["Gym", "Swimming Pool", "Parking"];
const tagOptions = ["For Sale", "For Rent", "New Launch"];

const AddProperty = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;

  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);

  const initialValues = {
    propertyName: "",
    propertyName_ar: "",
    description: "",
    description_ar: "",
    detailDescription: "",
    detailDescription_ar: "",
    price: "",
    apartmentNumber: "",
    noOfBedrooms: 0,
    noOfBathrooms: 0,
    yearBuilt: "",
    amenities: [],
    area: "",
    parkingSpace: "Yes",
    propertyType: "",
    listingType: "",
    availabilityStatus: "",
    status: "",
    address: "",
    latitude: "",
    longitude: "",
    images: [],
    noOfFloors: 0,
    floorPlans: [],
    metaTitle: "",
    metaTags: "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);
    setIsSubmitting(false);
  };

  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <Typography variant="h4" color="secondary" gutterBottom>
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
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Property Name</Typography>
                <TextField fullWidth name="propertyName" variant="outlined" value={values.propertyName} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.propertyName && errors.propertyName)} />
                <FormHelperText error>{touched.propertyName && errors.propertyName}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir='rtl'>اسم العقار</Typography>
                <TextField fullWidth name="propertyName" variant="outlined" value={values.propertyName_ar} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.propertyName && errors.propertyName)} />
                <FormHelperText error>{touched.propertyName_ar && errors.propertyName_ar}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Overview</Typography>
                <TextField fullWidth multiline minRows={3} name="description" variant="outlined" value={values.description} onChange={handleChange} />
                <FormHelperText error>{touched.description && errors.description}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir="rtl">نظرة عامة</Typography>
                <TextField fullWidth multiline minRows={3} name="description_ar" variant="outlined" value={values.description_ar} onChange={handleChange} />
                <FormHelperText error>{touched.description_ar && errors.description_ar}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" style={{ marginBottom: "5px" }}>
                 Detailed Description
                </Typography>


                <JoditEditor
                  ref={editorRefEn}
                  value={values.detailDescription}
                  tabIndex={1}
                  name="description"
                  variant="outlined"
                  config={{
                    readonly: isView || isLoading,
                    toolbar: true,

                  }}
                  error={Boolean(touched.detailDescription && errors.detailDescription)}
                  onBlur={(newContent) => setFieldValue("detailDescription", newContent)}
                />

                <FormHelperText error>{touched.detailDescription && errors.detailDescription}</FormHelperText>
              </Grid>
              {/* Description */}
              <Grid item xs={6}>
                <Typography variant="body2" dir='rtl' color="secondary" style={{ marginBottom: "5px" }}>
                  الوصف
                </Typography>

                <JoditEditor
                  ref={editorRefAr}
                  value={values.detailDescription_ar}
                  tabIndex={2}
                  name="detailDescription_ar"
                  config={{
                    readonly: isView || isLoading,
                    toolbar: true,
                    direction: "rtl",
                    language: "ar",

                  }}
                  error={Boolean(touched.detailDescription_ar && errors.detailDescription_ar)}

                  onBlur={(newContent) => setFieldValue("detailDescription_ar", newContent)}
                />


                <FormHelperText error>{touched.detailDescription_ar && errors.detailDescription_ar}</FormHelperText>
              </Grid>
              {/* Apartment Number */}
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Property Details
                </Typography>
              </Grid>
              {/* No of Floors */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Price</Typography>
                <TextField fullWidth name="price" variant="outlined" type="number" value={values.price} onChange={handleChange} />
                <FormHelperText error>{touched.price && errors.price}</FormHelperText>

              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Apartment Number</Typography>
                <TextField fullWidth name="apartmentNumber" variant="outlined" value={values.apartmentNumber} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.apartmentNumber && errors.apartmentNumber)} />
                <FormHelperText error>{touched.apartmentNumber && errors.apartmentNumber}</FormHelperText>
              </Grid>




              {/* Bedrooms */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">No of Bedrooms</Typography>
                <TextField fullWidth type="number" name="noOfBedrooms" variant="outlined" value={values.noOfBedrooms} onChange={handleChange} />
                <FormHelperText error>{touched.noOfBedrooms && errors.noOfBedrooms}</FormHelperText>

              </Grid>

              {/* Bathrooms */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">No of Bathrooms</Typography>
                <TextField fullWidth type="number" name="noOfBathrooms" variant="outlined" value={values.noOfBathrooms} onChange={handleChange} />
                <FormHelperText error>{touched.noOfBathrooms && errors.noOfBathrooms}</FormHelperText>

              </Grid>

              {/* Year Built */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Year of Built</Typography>
                <TextField fullWidth type="number" name="yearBuilt" variant="outlined" value={values.yearBuilt} onChange={handleChange} />
                <FormHelperText error>{touched.yearBuilt && errors.yearBuilt}</FormHelperText>

              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Amenities</Typography>
                <TextField
                  select
                  fullWidth
                  name="amenities"
                  variant="outlined"
                  value={values.amenities}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                    MenuProps: {
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null, // Ensures correct positioning
                    },
                  }}
                >
                  {amenitiesOptions.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.amenities && errors.amenities}</FormHelperText>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Area (sq ft)</Typography>
                <TextField fullWidth name="area" variant="outlined" value={values.area} onChange={handleChange} />
                <FormHelperText error>{touched.area && errors.area}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Parking Space</Typography>
                <TextField select fullWidth name="parkingSpace" variant="outlined" multiple value={values.parkingSpace} onChange={handleChange}>
                  {["Yes", "No"].map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.parkingSpace && errors.parkingSpace}</FormHelperText>

              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Listing Informations
                </Typography>
              </Grid>


              {/* Property Type */}
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Property Type</Typography>
                <TextField select fullWidth name="propertyType" variant="outlined" value={values.propertyType} onChange={handleChange} SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null, // Ensures correct positioning
                  },
                }}>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.propertyType && errors.propertyType}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Listing Type</Typography>
                <TextField select fullWidth name="listingType" variant="outlined" value={values.listingType} onChange={handleChange} SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null, // Ensures correct positioning
                  },
                }}>
                  {["For Sale", "Rent", "Fetured"].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.listingType && errors.listingType}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Availability Status</Typography>
                <TextField select fullWidth name="availabilityStatus" variant="outlined" value={values.propertyType} onChange={handleChange} SelectProps={{
                  MenuProps: {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null, // Ensures correct positioning
                  },
                }}>
                  {["Available", "Sold", "Rented"].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.availabilityStatus && errors.availabilityStatus}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Status</Typography>
                <TextField select fullWidth name="status" variant="outlined" value={values.status} onChange={handleChange}>
                  {["Published", "Draft"].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>{touched.status && errors.status}</FormHelperText>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Location
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Address</Typography>
                <TextField fullWidth name="address" variant="outlined" value={values.address} onChange={handleChange} />
                <FormHelperText error>{touched.address && errors.address}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Latitude</Typography>
                <TextField fullWidth name="latitude" variant="outlined" value={values.latitude} onChange={handleChange} />
                <FormHelperText error>{touched.latitude && errors.latitude}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">Longitude</Typography>
                <TextField fullWidth name="longitude" variant="outlined" value={values.longitude} onChange={handleChange} />
                <FormHelperText error>{touched.longitude && errors.longitude}</FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="secondary">Google Maps Preview</Typography>

                <iframe
                  title="Burj Khalifa Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.008447696045!2d55.27218761448589!3d25.197197837872875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f427891a58f0f%3A0xd4b108b1b10f733!2sBurj%20Khalifa!5e0!3m2!1sen!2sin!4v1653643184107!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

              </Grid>

              {/* Latitude */}


              <Grid item xs={12} mt={2}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Media
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="body2" color="secondary">Images</Typography>
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
                  <FormHelperText error>{touched.images && errors.images}</FormHelperText>

                </Box>
              </Grid>
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
              <Grid item xs={12} mt={2}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Tags
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">SEO Meta Titles</Typography>
                <TextField fullWidth name="metaTitle" variant="outlined" value={values.metaTitle} onChange={handleChange} />
                <FormHelperText error>{touched.metaTitle && errors.metaTitle}</FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">SEO Meta Tags</Typography>
                <TextField fullWidth name="metaTags" variant="outlined" value={values.metaTags} onChange={handleChange} />
                <FormHelperText error>{touched.metaTags && errors.metaTags}</FormHelperText>
              </Grid>

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
    </Paper >
  );
};

export default AddProperty;
