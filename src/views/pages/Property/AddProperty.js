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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import uploadFile, { getBase64 } from "src/utils";
import JoditEditor from "jodit-react";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { debounce } from "lodash";
import { apiRouterCall } from "../../../ApiConfig/service/index";
import toast from "react-hot-toast";
import FullScreenLoader from "../../../component/FullScreenLoader";

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
    .oneOf(["Active", "Inactive", "Published"], "Status must be either 'Active' or 'Inactive'"),

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

  floorPlans: yup.array().of(
    yup.object().shape({
      floorDescription: yup.string().required("Floor description is required"),
      floorPhoto: yup.string().required("Floor photo is required")
    })
  ).min(1, "At least one floor is required"),


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
// const amenitiesOptions = ["Gym", "Swimming Pool", "Parking"];
const tagOptions = ["For Sale", "For Rent", "New Launch"];

const AddProperty = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;
  const [amenitiesOptions, setAmenitiesOptions] = useState([])
  const history = useHistory()


  const editorRefEn = useRef(null);
  const editorRefAr = useRef(null);
  const handleGetAmenities = async (source, checkFilter) => {
    try {
      const response = await apiRouterCall({
        method: "GET",
        endPoint: "listAmenities",
        source: source,
        paramsData: { page: 1, limit: Number.MAX_SAFE_INTEGER },
      });
      console.log(response)
      if (response.data.responseCode === 200) {
        setAmenitiesOptions(response.data.result.docs);

      } else {
        setAmenitiesOptions([]);
      }


    } catch (err) {
      setAmenitiesOptions([]);
      setIsLoading(false);
      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleGetAmenities()
  }, [])
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
    floorPlans: [{
      floorDescription: "",
      floorPhoto: ""
    }],

    metaTitle: "",
    metaTags: "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("Form Submitted:", values);

    try {
      // Construct payload with schema keys
      const payload = {
        property_name: values.propertyName,
        property_name_ar: values.propertyName_ar,
        overview: values.description,
        overview_ar: values.description_ar,
        detailed_description: values.detailDescription,
        detailed_description_ar: values.detailDescription_ar,
        price: values.price,
        apartment_number: values.apartmentNumber,
        no_of_bedrooms: values.noOfBedrooms,
        no_of_bathrooms: values.noOfBathrooms,
        year_of_built: values.yearBuilt,
        amenities: values.amenities,
        area_sqft: values.area,
        parking_space: values.parkingSpace,
        property_type: values.propertyType,
        listing_type: values.listingType,
        availability_status: values.availabilityStatus,
        // status: values.status,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        images: values.images,
        floor_plan: values.floorPlans.map((floor) => ({
          photo: floor.floorPhoto,
          description: floor.floorDescription
        })),
        seo_meta_titles: values.metaTitle,
        seo_meta_tags: values.metaTags,
        // If you have no_of_floors separately:
        no_of_floors: values.floorPlans.length,
        publish_status: values.status // or "published" based on your form logic
      };

      // Call the API
      const res = await apiRouterCall({
        method: "POST",
        endPoint: "addUpdateProperty",
        bodyData: payload
      });

      if (res?.data?.responseCode === 200) {
        toast.success("Property added/updated successfully!");
        // Optionally, reset form or redirect here
        history.push("/property-management")
      } else {
        toast.error(res?.data?.responseMessage || "Error while adding/updating property");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const debounceSetFieldValue = useCallback(
    debounce((field, value, setFieldValue) => {
      setFieldValue(field, value);
    }, 300),
    []
  );

  // JoditEditor Configs
  const editorConfigEn = useMemo(
    () => ({
      readonly: isView || isLoading,
      toolbar: true,
    }),
    [isView, isLoading]
  );

  const editorConfigAr = useMemo(
    () => ({
      readonly: isView || isLoading,
      toolbar: true,
      direction: "rtl",
      language: "ar",
    }),
    [isView, isLoading]
  );


  return (
    <Paper elevation={2} className={classes.formWrapper}>
      <FullScreenLoader isLoading={isSubmitting} />
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
                <TextField fullWidth name="propertyName_ar" inputProps={{
                  style: { textAlign: "right" },
                  dir: "rtl",
                  lang: "ar",
                }} variant="outlined" value={values.propertyName_ar} onChange={handleChange} onBlur={handleBlur} error={Boolean(touched.propertyName && errors.propertyName)} />
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
                  config={editorConfigEn}
                  error={Boolean(touched.detailDescription && errors.detailDescription)}
                  onBlur={(newContent) => debounceSetFieldValue("detailDescription", newContent, setFieldValue)}
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
                  config={editorConfigAr}
                  error={Boolean(touched.detailDescription_ar && errors.detailDescription_ar)}

                  onBlur={(newContent) => debounceSetFieldValue("detailDescription_ar", newContent, setFieldValue)}
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
                      getContentAnchorEl: null,
                    },
                  }}
                >
                  {amenitiesOptions.map((amenity) => (
                    <MenuItem key={amenity._id} value={amenity._id}>
                      {amenity.title}
                    </MenuItem>
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
                <TextField select fullWidth name="availabilityStatus" variant="outlined" value={values.availabilityStatus} onChange={handleChange} SelectProps={{
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
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      const uploadedImageUrls = [];

                      setIsSubmitting(true); // Optionally set loading for entire upload process
                      for (const file of files) {
                        const uploadedUrl = await uploadFile(file, setIsSubmitting); // Upload each file
                        if (uploadedUrl) {
                          uploadedImageUrls.push(uploadedUrl); // Collect successful URLs
                        }
                      }

                      setFieldValue("images", [...values.images, ...uploadedImageUrls]);
                      setIsSubmitting(false); // Done with all uploads
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
              <Grid item xs={12}>
                <Typography variant="h6">Floor Plans</Typography>
                {values.floorPlans.map((floor, index) => (
                  <Box
                    key={index}
                    mb={2}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={4}
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    sx={{ gap: 20 }} // Use the MUI sx prop for gap
                  >

                    {/* Left Side: Description */}
                    <Box flex={1} display="flex" flexDirection="column">
                      <Typography variant="body2" color="secondary">{`Floor ${index + 1} Description`}</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name={`floorPlans[${index}].floorDescription`}
                        value={floor.floorDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.floorPlans?.[index]?.floorDescription &&
                          errors.floorPlans?.[index]?.floorDescription
                        )}
                        helperText={
                          touched.floorPlans?.[index]?.floorDescription &&
                          errors.floorPlans?.[index]?.floorDescription
                        }
                        variant="outlined"
                        margin="dense"
                      />
                      <Box mt="auto" display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<FiTrash2 />}

                          style={{ background: "red", color: "white !important" }}
                          onClick={() => {
                            const updatedFloors = values.floorPlans.filter((_, i) => i !== index);
                            setFieldValue("floorPlans", updatedFloors);
                          }}
                          disabled={values.floorPlans.length === 1}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>

                    {/* Right Side: Image Upload */}
                    <Box
                      flex={1}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      border={1}
                      borderColor="grey.300"
                      borderRadius={4}
                      overflow="hidden"
                      minHeight={200}
                    >
                      {!floor.floorPhoto ? (
                        <>
                          <input
                            id={`floor-photo-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const uploadedUrl = await uploadFile(file, setIsSubmitting); // Upload the file
                                if (uploadedUrl) {
                                  const updatedFloors = [...values.floorPlans];
                                  updatedFloors[index].floorPhoto = uploadedUrl; // Save the uploaded URL
                                  setFieldValue("floorPlans", updatedFloors);
                                }
                              }
                            }}
                          />
                          <label
                            htmlFor={`floor-photo-${index}`}
                            className="displayCenter"
                            style={{ cursor: "pointer", width: "100%", height: "100%" }}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              height="100%"
                              width="100%"
                              bgcolor="grey.100"
                              p={2}
                            >
                              <Avatar><FiUpload /></Avatar>
                              <Typography variant="body2" mt={1}>Upload Floor Photo</Typography>
                            </Box>
                          </label>
                        </>
                      ) : (
                        <Box
                          position="relative"
                          width="100%"
                          height="100%"
                        >
                          <img
                            src={floor.floorPhoto}
                            alt={`floor-${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 4
                            }}
                          />
                          <input
                            id={`floor-photo-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const uploadedUrl = await uploadFile(file, setIsSubmitting); // Upload the file
                                if (uploadedUrl) {
                                  const updatedFloors = [...values.floorPlans];
                                  updatedFloors[index].floorPhoto = uploadedUrl; // Save the uploaded URL
                                  setFieldValue("floorPlans", updatedFloors);
                                }
                              }
                            }}
                          />

                          <label
                            htmlFor={`floor-photo-${index}`}
                            style={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              borderRadius: "50%",
                              padding: 6,
                              cursor: "pointer"
                            }}
                          >
                            <FiUpload />
                          </label>
                        </Box>
                      )}
                      {touched.floorPlans?.[index]?.floorPhoto &&
                        errors.floorPlans?.[index]?.floorPhoto && (
                          <FormHelperText error>
                            {errors.floorPlans[index].floorPhoto}
                          </FormHelperText>
                        )}
                    </Box>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setFieldValue("floorPlans", [
                      ...values.floorPlans,
                      { floorDescription: "", floorPhoto: "" }
                    ]);
                  }}
                >
                  Add Floor
                </Button>
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
