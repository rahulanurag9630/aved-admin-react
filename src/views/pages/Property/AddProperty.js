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
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

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
  brochure: yup
    .string(),
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
  priceMin: yup
    .number()
    .nullable()
    .min(0, "Minimum price must be a positive number"),
  priceMax: yup
    .number()
    .nullable()
    .min(0, "Maximum price must be a positive number")
    .when("priceMin", (priceMin, schema) =>
      priceMin
        ? schema.min(priceMin, "Maximum price must be greater than or equal to minimum price")
        : schema
    ),
  apartmentNumber: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\- ]+$/,
      "Apartment number can only contain letters, numbers, hyphens, and spaces"
    )
    .nullable(),
  noOfBedrooms: yup
    .number()
    .required("Number of bedrooms is required")
    .min(0, "Number of bedrooms cannot be negative"),
  noOfBathrooms: yup
    .number()
    .required("Number of bathrooms is required")
    .min(0, "Number of bathrooms cannot be negative"),
  videoUrl: yup
    .string(),
  yearBuilt: yup
    .number()
    .nullable()
    .min(1800, "Year built must be after 1800")
    .max(new Date().getFullYear(), `Year built cannot be in the future`),
  amenities: yup.array().of(yup.string()).nullable().default([]),
  area: yup
    .number()
    .nullable()
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
    .oneOf(["For Sale", "Rent", "Featured"], "Listing type must be either 'Sale' or 'Rent'"),
  availabilityStatus: yup
    .string()
    .required("Availability status is required")
    .oneOf(["Available", "Sold", "Rented"], "Invalid availability status"),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["Active", "Inactive", "Published", "Draft"], "Status must be either 'Active' or 'Inactive'"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  address_ar: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  latitude: yup
    .string()
    .required("Latitude is required")
    .matches(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/, "Invalid latitude format"),
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
  partners: yup
    .array()
    .of(yup.mixed())
  ,
  floorPlans: yup
    .array()
    .of(
      yup.object().shape({
        floorDescription: yup.string().required("Floor description is required"),
        floorPhoto: yup.string().optional(),
        images: yup
          .array()
          .of(yup.string())
          .optional()
          .default([]),
      })
    )
    .min(1, "At least one floor is required"),
  landmarks: yup
    .array()
    .of(
      yup.object().shape({
        landmarkDescription: yup.string().required("Landmark description is required"),
        landmarkPhoto: yup.string().required("Landmark photo is required"),
      })
    )
    .min(1, "At least one landmark is required"),
  metaTitle: yup
    .string()
    .required("Meta title is required")
    .min(3, "Meta title must be at least 3 characters"),
  metaTags: yup
    .string()
    .required("Meta tags are required")
    .min(3, "Meta tags must be at least 3 characters"),
});

const propertyTypes = ["Apartment", "Studio", "Plot", "Hotel", "Townhouse", "Office"];
const tagOptions = ["For Sale", "For Rent", "New Launch"];

const AddProperty = () => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isView = location?.state?.isView;
  const isEdit = location?.state?.isEdit;
  const [amenitiesOptions, setAmenitiesOptions] = useState([]);
  const history = useHistory();

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
      if (response.data.responseCode === 200) {
        setAmenitiesOptions(response.data.result.docs);
      } else {
        setAmenitiesOptions([]);
      }
    } catch (err) {
      setAmenitiesOptions([]);
      setIsLoading(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAmenities();
  }, []);

  const state = location?.state || {};

  const initialValues = {
    ...(location?.state?._id && { id: location.state._id }),
    propertyName: state?.property_name || "",
    brochure: state?.brochure || "",
    propertyName_ar: state?.property_name_ar || "",
    description: state?.overview || "",
    description_ar: state?.overview_ar || "",
    detailDescription: state?.detailed_description || "",
    detailDescription_ar: state?.detailed_description_ar || "",
    videoUrl: state.videoUrl || "",
    priceMin: state?.price_min?.toString() || state?.price || "",
    priceMax: state?.price_max?.toString() || "",
    apartmentNumber: state?.apartment_number || "",
    noOfBedrooms: state?.no_of_bedrooms || 0,
    noOfBathrooms: state?.no_of_bathrooms || 0,
    yearBuilt: state?.year_of_built?.toString() || "",
    amenities: (state?.amenities || []).map((a) => a._id),
    area: state?.area_sqft?.toString() || "",
    parkingSpace: state?.parking_space || "Yes",
    propertyType: state?.property_type || "",
    listingType: state?.listing_type || "",
    availabilityStatus: state?.availability_status || "",
    status: state?.publish_status || "",
    address: state?.address || "",
    address_ar: state?.address_ar || "",
    latitude: state?.latitude?.toString() || "",
    longitude: state?.longitude?.toString() || "",
    images: state?.images || [],
    partners: state?.partners || [],
    floorPlans: (state?.floor_plan || []).map((fp) => ({
      floorDescription: fp.description || "",
      floorPhoto: fp.photo || "",
      images: fp.images || [],
    })),
    landmarks: (state?.landmarks || []).map((lm) => ({
      landmarkDescription: lm.description || "",
      landmarkPhoto: lm.photo || "",
    })),
    metaTitle: state?.seo_meta_titles || "",
    metaTags: state?.seo_meta_tags || "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("clicking")
    try {
      const payload = {
        ...(location?.state?._id && { id: location.state._id }),
        property_name: values.propertyName,
        brochure: values.brochure,
        property_name_ar: values.propertyName_ar,
        overview: values.description,
        overview_ar: values.description_ar,
        detailed_description: values.detailDescription,
        detailed_description_ar: values.detailDescription_ar,
        price_min: values.priceMin,
        price_max: values.priceMax,
        apartment_number: values.apartmentNumber,
        videoUrl: values.videoUrl,
        no_of_bedrooms: values.noOfBedrooms,
        no_of_bathrooms: values.noOfBathrooms,
        year_of_built: values.yearBuilt,
        amenities: values.amenities,
        area_sqft: values.area,
        parking_space: values.parkingSpace,
        property_type: values.propertyType,
        listing_type: values.listingType,
        availability_status: values.availabilityStatus,
        address: values.address,
        address_ar: values.address_ar,
        latitude: values.latitude,
        longitude: values.longitude,
        images: values.images,
        partners: values.partners,
        floor_plan: values.floorPlans.map((floor) => ({
          photo: floor.floorPhoto,
          description: floor.floorDescription,
          images: floor.images || [],
        })),
        landmarks: values.landmarks.map((landmark) => ({
          photo: landmark.landmarkPhoto,
          description: landmark.landmarkDescription,
        })),
        seo_meta_titles: values.metaTitle,
        seo_meta_tags: values.metaTags,
        no_of_floors: values.floorPlans.length,
        publish_status: values.status,
      };

      const res = await apiRouterCall({
        method: "POST",
        endPoint: "addUpdateProperty",
        bodyData: payload,
      });

      if (res?.data?.responseCode === 200) {
        toast.success("Property added/updated successfully!");
        history.push("/property-management");
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
        {state?.edit ? "Edit" : state?.view ? "View" : "Add"} New Property
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
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Property Name
                </Typography>
                <TextField
                  fullWidth
                  name="propertyName"
                  variant="outlined"
                  value={values.propertyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.propertyName && errors.propertyName)}
                />
                <FormHelperText error>
                  {touched.propertyName && errors.propertyName}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir="rtl">
                  اسم العقار
                </Typography>
                <TextField
                  fullWidth
                  name="propertyName_ar"
                  inputProps={{
                    style: { textAlign: "right" },
                    dir: "rtl",
                    lang: "ar",
                  }}
                  variant="outlined"
                  value={values.propertyName_ar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.propertyName_ar && errors.propertyName_ar)}
                />
                <FormHelperText error>
                  {touched.propertyName_ar && errors.propertyName_ar}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Overview
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  name="description"
                  variant="outlined"
                  value={values.description}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.description && errors.description}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir="rtl">
                  نظرة عامة
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{
                    style: { textAlign: "right" },
                    dir: "rtl",
                    lang: "ar",
                  }}
                  name="description_ar"
                  variant="outlined"
                  value={values.description_ar}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.description_ar && errors.description_ar}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  color="secondary"
                  style={{ marginBottom: "5px" }}
                >
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
                  onBlur={(newContent) =>
                    debounceSetFieldValue("detailDescription", newContent, setFieldValue)
                  }
                />
                <FormHelperText error>
                  {touched.detailDescription && errors.detailDescription}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  dir="rtl"
                  color="secondary"
                  style={{ marginBottom: "5px" }}
                >
                  الوصف
                </Typography>
                <JoditEditor
                  ref={editorRefAr}
                  value={values.detailDescription_ar}
                  tabIndex={2}
                  name="detailDescription_ar"
                  config={editorConfigAr}
                  error={Boolean(
                    touched.detailDescription_ar && errors.detailDescription_ar
                  )}
                  onBlur={(newContent) =>
                    debounceSetFieldValue("detailDescription_ar", newContent, setFieldValue)
                  }
                />
                <FormHelperText error>
                  {touched.detailDescription_ar && errors.detailDescription_ar}
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Property Details
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Minimum Price
                </Typography>
                <TextField
                  fullWidth
                  name="priceMin"
                  variant="outlined"
                  type="number"
                  value={values.priceMin}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.priceMin && errors.priceMin}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Maximum Price
                </Typography>
                <TextField
                  fullWidth
                  name="priceMax"
                  variant="outlined"
                  type="number"
                  value={values.priceMax}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.priceMax && errors.priceMax}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Apartment Number
                </Typography>
                <TextField
                  fullWidth
                  name="apartmentNumber"
                  variant="outlined"
                  value={values.apartmentNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.apartmentNumber && errors.apartmentNumber)}
                />
                <FormHelperText error>
                  {touched.apartmentNumber && errors.apartmentNumber}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  No of Bedrooms
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="noOfBedrooms"
                  variant="outlined"
                  value={values.noOfBedrooms}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.noOfBedrooms && errors.noOfBedrooms}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  No of Bathrooms
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="noOfBathrooms"
                  variant="outlined"
                  value={values.noOfBathrooms}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.noOfBathrooms && errors.noOfBathrooms}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Year of Built
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="yearBuilt"
                  variant="outlined"
                  value={values.yearBuilt}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.yearBuilt && errors.yearBuilt}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Amenities
                </Typography>
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
                <FormHelperText>
                  {touched.amenities && errors.amenities}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Area (sq ft)
                </Typography>
                <TextField
                  fullWidth
                  name="area"
                  variant="outlined"
                  value={values.area}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.area && errors.area}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Parking Space
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="parkingSpace"
                  variant="outlined"
                  value={values.parkingSpace}
                  onChange={handleChange}
                >
                  {["Yes", "No"].map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {touched.parkingSpace && errors.parkingSpace}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="body2" color="secondary">
                  Brochure
                </Typography>
                <Box className={classes.imageUploadBox}>
                  <input
                    id="brochure-upload"
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setIsSubmitting(true);
                      const uploadedUrl = await uploadFile(file, setIsSubmitting);
                      if (uploadedUrl) {
                        setFieldValue("brochure", uploadedUrl); // storing single brochure link
                      }
                      setIsSubmitting(false);
                    }}
                  />
                  <label
                    htmlFor="brochure-upload"
                    className="displayCenter"
                    style={{ flexDirection: "column" }}
                  >
                    <Avatar>
                      <FiUpload />
                    </Avatar>
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                      Click to upload brochure (PDF)
                    </Typography>
                  </label>

                  {values.brochure && (
                    <Box mt={2} className={classes.previewImageWrapper}>
                      <IconButton
                        className={classes.removeIcon}
                        onClick={() => setFieldValue("brochure", "")}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <iframe
                        src={values.brochure}
                        width="100%"
                        height="400px"
                        title="Brochure Preview"
                        style={{ border: "1px solid #ccc", borderRadius: 4 }}
                      />
                    </Box>
                  )}

                  <FormHelperText error>
                    {touched.brochure && errors.brochure}
                  </FormHelperText>
                </Box>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="body2" color="secondary">
                  Partner Images
                </Typography>
                <Box className={classes.imageUploadBox}>
                  <input
                    id="partner-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      const uploadedPartnerUrls = [];
                      setIsSubmitting(true);
                      for (const file of files) {
                        const uploadedUrl = await uploadFile(file, setIsSubmitting);
                        if (uploadedUrl) {
                          uploadedPartnerUrls.push(uploadedUrl);
                        }
                      }
                      setFieldValue("partners", [...(values.partners || []), ...uploadedPartnerUrls]);
                      setIsSubmitting(false);
                    }}
                  />
                  <label
                    htmlFor="partner-upload"
                    className="displayCenter"
                    style={{ flexDirection: "column" }}
                  >
                    <Avatar>
                      <FiUpload />
                    </Avatar>
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                      Click to upload partner images
                    </Typography>
                  </label>

                  <Box display="flex" flexWrap="wrap" mt={2}>
                    {(values.partners || []).map((img, i) => (
                      <Box key={i} className={classes.previewImageWrapper}>
                        <IconButton
                          className={classes.removeIcon}
                          onClick={() => {
                            const updatedPartners = values.partners.filter((_, index) => index !== i);
                            setFieldValue("partners", updatedPartners);
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <img
                          src={img}
                          alt={`partner-${i}`}
                          className={classes.previewImage}
                        />
                      </Box>
                    ))}
                  </Box>

                  <FormHelperText error>
                    {touched.partners && errors.partners}
                  </FormHelperText>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Listing Information
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Property Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="propertyType"
                  variant="outlined"
                  value={values.propertyType}
                  onChange={handleChange}
                  SelectProps={{
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
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {touched.propertyType && errors.propertyType}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Listing Type
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="listingType"
                  variant="outlined"
                  value={values.listingType}
                  onChange={handleChange}
                  SelectProps={{
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
                  {["For Sale", "Rent", "Featured"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {touched.listingType && errors.listingType}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Availability Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="availabilityStatus"
                  variant="outlined"
                  value={values.availabilityStatus}
                  onChange={handleChange}
                  SelectProps={{
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
                  {["Available", "Sold", "Rented"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {touched.availabilityStatus && errors.availabilityStatus}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="status"
                  variant="outlined"
                  value={values.status}
                  onChange={handleChange}
                >
                  {["Published", "Draft"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {touched.status && errors.status}
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Location
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Address
                </Typography>
                <TextField
                  fullWidth
                  name="address"
                  variant="outlined"
                  value={values.address}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.address && errors.address}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary" dir="rtl">
                  العنوان
                </Typography>
                <TextField
                  fullWidth
                  name="address_ar"
                  variant="outlined"
                  inputProps={{
                    style: { textAlign: "right" },
                    dir: "rtl",
                    lang: "ar",
                  }}
                  value={values.address_ar}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.address_ar && errors.address_ar}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Latitude
                </Typography>
                <TextField
                  fullWidth
                  name="latitude"
                  variant="outlined"
                  value={values.latitude}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.latitude && errors.latitude}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Longitude
                </Typography>
                <TextField
                  fullWidth
                  name="longitude"
                  variant="outlined"
                  value={values.longitude}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.longitude && errors.longitude}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="secondary">
                  Google Maps Preview
                </Typography>
                <iframe
                  title="Google Maps"
                  src={`https://maps.google.com/maps?q=${values.latitude || 0},${values.longitude || 0}&z=15&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Grid>


              <Grid item xs={12} mt={2}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Media
                </Typography>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Typography variant="body2" color="secondary">
                  Images
                </Typography>
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
                      setIsSubmitting(true);
                      for (const file of files) {
                        const uploadedUrl = await uploadFile(file, setIsSubmitting);
                        if (uploadedUrl) {
                          uploadedImageUrls.push(uploadedUrl);
                        }
                      }
                      setFieldValue("images", [...values.images, ...uploadedImageUrls]);
                      setIsSubmitting(false);
                    }}
                  />
                  <label
                    htmlFor="image-upload"
                    className="displayCenter"
                    style={{ flexDirection: "column" }}
                  >
                    <Avatar>
                      <FiUpload />
                    </Avatar>
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                      Click to upload images (First image will be Thumbnail image)
                    </Typography>
                  </label>
                  <Box display="flex" flexWrap="wrap" mt={2}>
                    {values.images.map((img, i) => (
                      <Box key={i} className={classes.previewImageWrapper}>
                        <IconButton
                          className={classes.removeIcon}
                          onClick={() => {
                            const updatedImages = values.images.filter((_, index) => index !== i);
                            setFieldValue("images", updatedImages);
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <img
                          src={img}
                          alt={`preview-${i}`}
                          className={classes.previewImage}
                        />
                      </Box>
                    ))}
                  </Box>

                  <FormHelperText error>
                    {touched.images && errors.images}
                  </FormHelperText>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  Video URL
                </Typography>
                <TextField
                  fullWidth
                  name="videoUrl"
                  variant="outlined"
                  value={values.videoUrl}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.videoUrl && errors.videoUrl}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Floor Plans
                </Typography>
                {values.floorPlans.map((floor, index) => (
                  <Box
                    key={index}
                    mb={3}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={4}
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    gap={4}
                  >
                    {/* LEFT: Floor Photo */}
                    <Box flex={0.4}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        border={1}
                        borderColor="grey.300"
                        borderRadius={4}
                        minHeight={220}
                        overflow="hidden"
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
                                  const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                  if (uploadedUrl) {
                                    const updatedFloors = [...values.floorPlans];
                                    updatedFloors[index].floorPhoto = uploadedUrl;
                                    setFieldValue("floorPlans", updatedFloors);
                                  }
                                  setIsSubmitting(false);
                                }
                              }}
                            />
                            <label
                              htmlFor={`floor-photo-${index}`}
                              style={{ cursor: "pointer", width: "100%", height: "100%" }}
                            >
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                height="100%"
                                bgcolor="grey.100"
                                p={2}
                              >
                                <Avatar>
                                  <FiUpload />
                                </Avatar>
                                <Typography variant="body2" mt={1}>
                                  Upload Floor Photo
                                </Typography>
                              </Box>
                            </label>
                          </>
                        ) : (
                          <Box position="relative" width="100%" height="100%">
                            <img
                              src={floor.floorPhoto}
                              alt={`floor-${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 4,
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
                                  const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                  if (uploadedUrl) {
                                    const updatedFloors = [...values.floorPlans];
                                    updatedFloors[index].floorPhoto = uploadedUrl;
                                    setFieldValue("floorPlans", updatedFloors);
                                  }
                                  setIsSubmitting(false);
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
                                cursor: "pointer",
                              }}
                            >
                              <FiUpload />
                            </label>
                          </Box>
                        )}
                      </Box>

                      {touched.floorPlans?.[index]?.floorPhoto &&
                        errors.floorPlans?.[index]?.floorPhoto && (
                          <FormHelperText error>
                            {errors.floorPlans[index].floorPhoto}
                          </FormHelperText>
                        )}

                      <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<FiTrash2 />}
                          style={{ background: "red", color: "white" }}
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

                    {/* RIGHT: Additional Images */}
                    <Box flex={0.6}>
                      <input
                        id={`floor-images-${index}`}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          const uploadedImageUrls = [];
                          setIsSubmitting(true);
                          for (const file of files) {
                            const uploadedUrl = await uploadFile(file, setIsSubmitting);
                            if (uploadedUrl) {
                              uploadedImageUrls.push(uploadedUrl);
                            }
                          }
                          const updatedFloors = [...values.floorPlans];
                          updatedFloors[index].images = [
                            ...(updatedFloors[index].images || []),
                            ...uploadedImageUrls,
                          ];
                          setFieldValue("floorPlans", updatedFloors);
                          setIsSubmitting(false);
                        }}
                      />
                      <label
                        htmlFor={`floor-images-${index}`}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Avatar>
                          <FiUpload />
                        </Avatar>
                        <Typography variant="body2" mt={1}>
                          Upload Additional Images
                        </Typography>
                      </label>

                      <Box
                        display="flex"
                        flexWrap="wrap"
                        gap={2}
                        mt={2}
                        justifyContent="flex-start"
                      >
                        {(floor.images || []).map((img, i) => (
                          <Box
                            key={i}
                            position="relative"
                            width={150}
                            height={150}
                            borderRadius={2}
                            marginRight={"3px"}
                            overflow="hidden"
                          >
                            <IconButton
                              size="small"
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                zIndex: 1,
                              }}
                              onClick={() => {
                                const updatedFloors = [...values.floorPlans];
                                updatedFloors[index].images = updatedFloors[index].images.filter(
                                  (_, imgIndex) => imgIndex !== i
                                );
                                setFieldValue("floorPlans", updatedFloors);
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                            <img
                              src={img}
                              alt={`floor-image-${index}-${i}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          </Box>
                        ))}
                      </Box>

                      {touched.floorPlans?.[index]?.images &&
                        errors.floorPlans?.[index]?.images && (
                          <FormHelperText error>
                            {errors.floorPlans[index].images}
                          </FormHelperText>
                        )}
                    </Box>
                  </Box>
                ))}
                {state?.view ? null : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setFieldValue("floorPlans", [
                        ...values.floorPlans,
                        { floorDescription: "", floorPhoto: "", images: [] },
                      ]);
                    }}
                  >
                    {state?.edit ? "Update" : "Add Floor"}
                  </Button>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Landmarks</Typography>
                {values.landmarks.map((landmark, index) => (
                  <Box
                    key={index}
                    mb={2}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={4}
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    sx={{ gap: 20 }}
                  >
                    <Box flex={1} display="flex" flexDirection="column">
                      <Typography variant="body2" color="secondary">{`Landmark ${index + 1
                        } Description`}</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name={`landmarks[${index}].landmarkDescription`}
                        value={landmark.landmarkDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.landmarks?.[index]?.landmarkDescription &&
                          errors.landmarks?.[index]?.landmarkDescription
                        )}
                        helperText={
                          touched.landmarks?.[index]?.landmarkDescription &&
                          errors.landmarks?.[index]?.landmarkDescription
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
                            const updatedLandmarks = values.landmarks.filter(
                              (_, i) => i !== index
                            );
                            setFieldValue("landmarks", updatedLandmarks);
                            console.log(errors)
                          }}
                          disabled={values.landmarks.length === 1}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
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
                      {!landmark.landmarkPhoto ? (
                        <>
                          <input
                            id={`landmark-photo-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                if (uploadedUrl) {
                                  const updatedLandmarks = [...values.landmarks];
                                  updatedLandmarks[index].landmarkPhoto = uploadedUrl;
                                  setFieldValue("landmarks", updatedLandmarks);
                                }
                              }
                            }}
                          />
                          <label
                            htmlFor={`landmark-photo-${index}`}
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
                              <Avatar>
                                <FiUpload />
                              </Avatar>
                              <Typography variant="body2" mt={1}>
                                Upload Landmark Photo
                              </Typography>
                            </Box>
                          </label>
                        </>
                      ) : (
                        <Box position="relative" width="100%" height="100%">
                          <img
                            src={landmark.landmarkPhoto}
                            alt={`landmark-${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                          <input
                            id={`landmark-photo-${index}`}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                if (uploadedUrl) {
                                  const updatedLandmarks = [...values.landmarks];
                                  updatedLandmarks[index].landmarkPhoto = uploadedUrl;
                                  setFieldValue("landmarks", updatedLandmarks);
                                }
                              }
                            }}
                          />
                          <label
                            htmlFor={`landmark-photo-${index}`}
                            style={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              borderRadius: "50%",
                              padding: 6,
                              cursor: "pointer",
                            }}
                          >
                            <FiUpload />
                          </label>
                        </Box>
                      )}
                      {touched.landmarks?.[index]?.landmarkPhoto &&
                        errors.landmarks?.[index]?.landmarkPhoto && (
                          <FormHelperText error>
                            {errors.landmarks[index].landmarkPhoto}
                          </FormHelperText>
                        )}
                    </Box>
                  </Box>
                ))}
                {state?.view ? null : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setFieldValue("landmarks", [
                        ...values.landmarks,
                        { landmarkDescription: "", landmarkPhoto: "" },
                      ]);
                    }}
                  >
                    {state?.edit ? "Update" : "Add Landmark"}
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} mt={2}>
                <Typography variant="h6" color="secondary" gutterBottom>
                  Tags
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  SEO Meta Titles
                </Typography>
                <TextField
                  fullWidth
                  name="metaTitle"
                  variant="outlined"
                  value={values.metaTitle}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.metaTitle && errors.metaTitle}
                </FormHelperText>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="secondary">
                  SEO Meta Tags
                </Typography>
                <TextField
                  fullWidth
                  name="metaTags"
                  variant="outlined"
                  value={values.metaTags}
                  onChange={handleChange}
                />
                <FormHelperText error>
                  {touched.metaTags && errors.metaTags}
                </FormHelperText>
              </Grid>

              <Grid item xs={12} className="displayCenter">
                <Button
                  variant="contained"
                  color="secondary"
                  className="filterButtonCustom"
                  type="submit"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Back"}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => console.log(errors)}
                >
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