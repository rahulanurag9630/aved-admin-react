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
  Chip,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import uploadFile, { getBase64, uploadFiles, uploadFileS3 } from "src/utils";
import JoditEditor from "jodit-react";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { debounce } from "lodash";
import { apiRouterCall } from "../../../ApiConfig/service/index";
import toast from "react-hot-toast";
import FullScreenLoader from "../../../component/FullScreenLoader";
import ObjectViewer from "../../../component/ObjectViewer";
import Loader from "../../../component/Loader";
import {
  Home as HomeIcon,
  Info as InfoIcon,
  AttachMoney as PriceIcon,
  LocationOn as LocationIcon,
  PhotoCamera as ImageIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  Search as SeoIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    padding: theme.spacing(3),
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: theme.spacing(4),
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
    textAlign: "center",
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    fontWeight: 400,
    textAlign: "center",
    marginBottom: "32px",
  },
  sectionContainer: {
    marginBottom: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: theme.spacing(4),
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
    },
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "28px",
    paddingBottom: "16px",
    borderBottom: "3px solid #667eea",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-3px",
      left: 0,
      width: "60px",
      height: "3px",
      backgroundColor: "#667eea",
      borderRadius: "2px",
    },
  },
  sectionIcon: {
    color: "#667eea",
    fontSize: "24px",
  },
  fieldGroup: {
    marginBottom: "28px",
    padding: "0 4px",
  },
  fieldLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "8px",
    display: "block",
  },
  fieldLabelArabic: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "8px",
    display: "block",
    textAlign: "right",
    direction: "rtl",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      "& fieldset": {
        borderColor: "#d1d5db",
      },
      "&:hover fieldset": {
        borderColor: "#9ca3af",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
      },
    },
    "& .MuiInputBase-input": {
      padding: "12px 16px",
      fontSize: "16px",
      color: "#1e293b",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#9ca3af",
      opacity: 1,
    },
  },
  imageUploadBox: {
    border: "2px dashed #d1d5db",
    padding: theme.spacing(3),
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: "#f9fafb",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#667eea",
      backgroundColor: "#f0f4ff",
    },
  },
  previewImage: {
    height: "120px",
    width: "120px",
    borderRadius: "12px",
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    objectFit: "cover",
    border: "2px solid #e2e8f0",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
  },
  submitButton: {
    backgroundColor: "#667eea",
    color: "white",
    borderRadius: "8px",
    padding: "12px 32px",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    minWidth: "140px",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    "&:hover": {
      backgroundColor: "#5a67d8",
      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.5)",
    },
    "&:disabled": {
      backgroundColor: "#9ca3af",
      boxShadow: "none",
    },
  },
  backButton: {
    backgroundColor: "#ffffff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px 32px",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    minWidth: "140px",
    "&:hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#9ca3af",
    },
  },
  editorContainer: {
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
    "& .jodit-container": {
      border: "none",
    },
  },
  required: {
    color: "#ef4444",
    marginLeft: "4px",
  },
}));

const validationSchema = yup.object().shape({
  propertyName: yup
    .string()
    //.required("Property name is required")
    .min(3, "Property name must be at least 3 characters"),
  brochure: yup
    .string(),
  propertyName_ar: yup
    .string()
    //.required("Property name (Arabic) is required")
    .min(3, "Property name (Arabic) must be at least 3 characters"),
  description: yup
    .string()
    //.required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  description_ar: yup
    .string()
    //.required("Description (Arabic) is required")
    .min(10, "Description (Arabic) must be at least 10 characters"),
  detailDescription: yup
    .string()
    //.required("Detailed description is required")
    .min(20, "Detailed description must be at least 20 characters"),
  detailDescription_ar: yup
    .string()
    //.required("Detailed description (Arabic) is required")
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
    .string()
  //.required("Number of bedrooms is required")
  ,
  noOfBathrooms: yup
    .string(),
  //.required("Number of bathrooms is required"),
  videoUrl: yup
    .string(),
  yearBuilt: yup
    .number()
    .nullable()
    .min(1800, "Year built must be after 1800"),
  amenities: yup.array().of(yup.string()).nullable().default([]),
  area: yup
    .string()
  //.required("Area must be a valid number and it is required")
  ,

  parkingSpace: yup
    .string()
    .oneOf(["Yes", "No"], "Parking space must be either 'Yes' or 'No'"),
  //.required("Parking space selection is required"),
  no_of_parking_space: yup
    .string()
  , propertyType: yup
    .string()
    //.required("Property type is required")
    .min(3, "Property type must be at least 3 characters"),
  listingType: yup
    .string()
    //.required("Listing type is required")
    .oneOf(["For Sale", "Rent", "Featured", "Sold", "Soon"], "Listing type must be either 'Sale' or 'Rent'"),
  availabilityStatus: yup
    .string()
    //.required("Availability status is required")
    .oneOf(["Available", "Sold", "Rented"], "Invalid availability status"),
  // status: yup
  //   .string()
  //   //.required("Status is required")
  //   .oneOf(["Active", "Inactive", "Published", "Draft"], "Status must be either 'Active' or 'Inactive'"),
  address: yup
    .string()
    //.required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  address_ar: yup
    .string()
    //.required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  latitude: yup
    .string()
    //.required("Latitude is required")
    .matches(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/, "Invalid latitude format"),
  longitude: yup
    .string()
    //.required("Longitude is required")
    .matches(
      /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?|180(\.0+)?/,
      "Invalid longitude format"
    ),
  images: yup
    .array()
    .of(yup.mixed()),
  // .min(1, "At least one image is required")
  // .required("Images are required"),
  interiorDesign: yup
    .array(),
  // .of(yup.mixed().required("Interior Design is required"))
  // .min(1, "At least one Interior Design is required")
  // .required("Interior Design are required"),
  exteriorDesign: yup
    .array(),
  // .of(yup.mixed().required("Exterior Design is required"))
  // .min(1, "At least one Exterior Design is required")
  // .required("Exterior Design are required"),
  partners: yup
    .array()
    .of(yup.mixed())
  ,
  floorPlans: yup
    .array(),
  // .of(
  //   yup.object().shape({
  //     floorDescription: yup.string(),
  //     floorPhoto: yup.string().required("floor plan photo is required"),
  //     images: yup
  //       .array()
  //       .of(yup.string())
  //       .optional()
  //       .default([]),
  //   })
  // )
  // .min(1, "At least one floor is required"),
  bathrooms: yup
    .array(),
  // .of(
  //   yup.object().shape({
  //     photo: yup.string().optional(),
  //     images: yup
  //       .array()
  //       .of(yup.string())
  //       .optional()
  //       .default([]),
  //   })
  // )
  bedrooms: yup
    .array()
  // .of(
  //   yup.object().shape({
  //     photo: yup.string().optional(),
  //     images: yup
  //       .array()
  //       .of(yup.string())
  //       .optional()
  //       .default([]),
  //   })
  // )
  ,  // landmarks: yup
  //   .array()
  //   .of(
  //     yup.object().shape({
  //       landmarkDescription: yup.string().required("Landmark description is required"),
  //       landmarkPhoto: yup.string().required("Landmark photo is required"),
  //     })
  //   )
  //   .min(1, "At least one landmark is required"),
  metaTitle: yup
    .string()
    // .required("Meta title is required")
    .min(3, "Meta title must be at least 3 characters"),
  metaTags: yup
    .string()
    // .required("Meta tags are required")
    .min(3, "Meta tags must be at least 3 characters"),
});

const propertyTypes = ["Villa", "Apartment", "Studio", "Plot", "Hotel", "Townhouse", "Office"];
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
  const [objectUrl, setObjectUrl] = useState(location?.state?.virtualTour || "");


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
    noOfBedrooms: state?.no_of_bedrooms?.toString() || "0",
    noOfBathrooms: state?.no_of_bathrooms?.toString() || "0",
    yearBuilt: state?.year_of_built?.toString() || "",
    amenities: (state?.amenities || []).map((a) => a._id),
    area: state?.area_sqft?.toString() || "",
    parkingSpace: state?.parking_space || "Yes",
    no_of_parking_space: state?.no_of_parking_space || "0",
    propertyType: state?.property_type || "",
    listingType: state?.listing_type || "",
    availabilityStatus: state?.availability_status || "",
    // status: state?.publish_status || "",
    address: state?.address || "",
    address_ar: state?.address_ar || "",
    latitude: state?.latitude?.toString() || "",
    longitude: state?.longitude?.toString() || "",
    images: state?.images || [],
    interiorDesign: state?.interiorDesign || [],
    exteriorDesign: state?.exteriorDesign || [],
    partners: state?.partners || [],
    floorPlans: (state?.floor_plan || []).map((fp) => ({
      floorDescription: fp.description || "",
      floorPhoto: fp.photo || "",
      images: fp.images || [],
    })),
    bedrooms: (state?.bedrooms || []).map((fp) => ({
      photo: fp.photo || "",
      images: fp.images || [],
    })),
    bathrooms: (state?.bathrooms || []).map((fp) => ({
      photo: fp.photo || "",
      images: fp.images || [],
    })),
    // landmarks: (state?.landmarks || []).map((lm) => ({
    //   landmarkDescription: lm.description || "",
    //   landmarkPhoto: lm.photo || "",
    // })),
    metaTitle: state?.seo_meta_titles || "",
    metaTags: state?.seo_meta_tags || "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("clicking");

    try {
      // Build the base payload
      let payload = {
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
        no_of_parking_space: values.no_of_parking_space,
        property_type: values.propertyType,
        listing_type: values.listingType,
        availability_status: values.availabilityStatus,
        address: values.address,
        address_ar: values.address_ar,
        latitude: values.latitude,
        longitude: values.longitude,
        images: values.images,
        interiorDesign: values.interiorDesign,
        exteriorDesign: values.exteriorDesign,
        partners: values.partners,
        floor_plan: values.floorPlans?.map((floor) => ({
          photo: floor.floorPhoto,
          images: floor.images || [],
        })),
        bedrooms: values.bedrooms?.map((floor) => ({
          photo: floor.photo,
          images: floor.images || [],
        })),
        bathrooms: values.bathrooms?.map((floor) => ({
          photo: floor.photo,
          images: floor.images || [],
        })),
        // landmarks: values.landmarks?.map((landmark) => ({
        //   photo: landmark.landmarkPhoto,
        //   description: landmark.landmarkDescription,
        // })),
        seo_meta_titles: values.metaTitle,
        seo_meta_tags: values.metaTags,
        no_of_floors: values.floorPlans?.length,
        // publish_status: values.status,
        virtualTour: objectUrl
      };
      console.log(payload)
      // 🔍 Remove empty/null/undefined fields
      payload = Object.fromEntries(
        Object.entries(payload).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            (typeof value !== "string" || value.trim() !== "")
        )
      );

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
    <Box className={classes.formWrapper}>
      <FullScreenLoader isLoading={isSubmitting} />

      <Paper elevation={2} className={classes.formContainer}>
        <Typography className={classes.pageTitle}>
          {state?.edit ? "Edit" : state?.view ? "View" : "Add"} Property
        </Typography>
        <Typography className={classes.pageSubtitle}>
          {state?.edit ? "Update property information" : state?.view ? "View property details" : "Enter property details to create a new listing"}
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
              {/* Basic Information Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <HomeIcon className={classes.sectionIcon} />
                  Basic Information
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Property Name  {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter property name"
                        name="propertyName"
                        variant="outlined"
                        value={values.propertyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.propertyName && errors.propertyName)}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.propertyName && errors.propertyName}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabelArabic}>
                        اسم العقار {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="أدخل اسم العقار"   // ✅ Arabic placeholder

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
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.propertyName_ar && errors.propertyName_ar}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Overview {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter property overview"   // ✅ English placeholder

                        multiline
                        minRows={3}
                        name="description"
                        variant="outlined"
                        value={values.description}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.description && errors.description}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabelArabic}>
                        نظرة عامة {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="أدخل نظرة عامة عن العقار"

                        inputProps={{
                          style: { textAlign: "right" },
                          dir: "rtl",
                          lang: "ar",
                        }}
                        name="description_ar"
                        variant="outlined"
                        value={values.description_ar}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.description_ar && errors.description_ar}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Detailed Description (English) {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <Box className={classes.editorContainer}>
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
                      </Box>
                      <FormHelperText error>
                        {touched.detailDescription && errors.detailDescription}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabelArabic}>
                        الوصف المفصل (العربية) {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <Box className={classes.editorContainer}>
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
                      </Box>
                      <FormHelperText error>
                        {touched.detailDescription_ar && errors.detailDescription_ar}
                      </FormHelperText>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Property Details Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <InfoIcon className={classes.sectionIcon} />
                  Property Details
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Minimum Price
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter minimum price"

                        name="priceMin"
                        variant="outlined"
                        type="number"
                        value={values.priceMin}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.priceMin && errors.priceMin}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Maximum Price
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter maximum price"

                        name="priceMax"
                        variant="outlined"
                        type="number"
                        value={values.priceMax}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.priceMax && errors.priceMax}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Apartment Number
                      </Typography>
                      <TextField
                        fullWidth
                        name="apartmentNumber"
                        placeholder="Enter apartment number"

                        variant="outlined"
                        value={values.apartmentNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.apartmentNumber && errors.apartmentNumber)}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.apartmentNumber && errors.apartmentNumber}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Number of Bedrooms {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter number of bedrooms"

                        name="noOfBedrooms"
                        variant="outlined"
                        value={values.noOfBedrooms}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.noOfBedrooms && errors.noOfBedrooms}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Number of Bathrooms {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter number of bathrooms"

                        name="noOfBathrooms"
                        variant="outlined"
                        value={values.noOfBathrooms}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.noOfBathrooms && errors.noOfBathrooms}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Year Built
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Enter year of built"
                        name="yearBuilt"
                        variant="outlined"
                        value={values.yearBuilt}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.yearBuilt && errors.yearBuilt}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Amenities
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        name="amenities"
                        variant="outlined"
                        value={values.amenities}
                        onChange={handleChange}
                        displayEmpty
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
                        className={classes.textField}
                        disabled={isView}
                      >
                        <MenuItem disabled value="">
                          Select amenities
                        </MenuItem>
                        {amenitiesOptions.map((amenity) => (
                          <MenuItem key={amenity._id} value={amenity._id}>
                            {amenity.title}
                          </MenuItem>
                        ))}
                      </TextField>

                      <FormHelperText>
                        {touched.amenities && errors.amenities}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Build up area
                        {/* (m²) */}
                      </Typography>

                      <TextField
                        fullWidth
                        placeholder="Please enter build up area"
                        name="area"
                        variant="outlined"
                        value={values.area}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.area && errors.area}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Parking Space {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        name="parkingSpace"
                        variant="outlined"
                        value={values.parkingSpace}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
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
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        No of Parking Space
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Please enter no or parking space"
                        name="no_of_parking_space"
                        variant="outlined"
                        value={values.no_of_parking_space}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      >

                      </TextField>
                      <FormHelperText error>
                        {touched.no_of_parking_space && errors.no_of_parking_space}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Property Brochure
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isSubmitting && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading brochure...
                            </Typography>
                          </Box>
                        )}
                        <input
                          id="brochure-upload"
                          type="file"
                          accept="application/pdf"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setIsSubmitting(true);
                            const uploadedUrl = await uploadFileS3(file, setIsSubmitting);
                            if (uploadedUrl) {
                              setFieldValue("brochure", uploadedUrl); // storing single brochure link
                            }
                            setIsSubmitting(false);
                          }}
                        />
                        <label
                          htmlFor="brochure-upload"
                          className="displayCenter"
                          style={{ flexDirection: "column", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}
                        >
                          <Avatar>
                            <FiUpload />
                          </Avatar>
                          <Typography variant="body2" style={{ marginTop: 8 }}>
                            Click to upload brochure (PDF)
                          </Typography>
                        </label>

                        {values.brochure && (
                          <Box style={{ marginTop: "16px", textAlign: "center" }}>
                            <Box style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "12px",
                              padding: "12px",
                              backgroundColor: "#f0f9ff",
                              borderRadius: "8px",
                              border: "1px solid #e0f2fe"
                            }}>
                              <Typography variant="body2" style={{ color: "#0369a1", marginRight: "8px" }}>
                                📄 Brochure uploaded successfully
                              </Typography>
                            </Box>
                            <Box style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => window.open(values.brochure, '_blank')}
                                style={{
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  textTransform: "none",
                                  fontSize: "12px"
                                }}
                              >
                                View in Browser
                              </Button>
                              {!isView && (
                                <>
                                  <input
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    id="brochure-replace-upload"
                                    type="file"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        try {
                                          setIsSubmitting(true);
                                          const url = await uploadFileS3(file, setIsSubmitting);
                                          if (url) setFieldValue("brochure", url);
                                        } catch (err) {
                                          toast.error("Brochure upload failed!");
                                        } finally {
                                          setIsSubmitting(false);
                                        }
                                      }
                                    }}
                                  />
                                  <label htmlFor="brochure-replace-upload">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      component="span"
                                      style={{
                                        borderColor: "#10b981",
                                        color: "#10b981",
                                        textTransform: "none",
                                        fontSize: "12px"
                                      }}
                                    >
                                      Replace
                                    </Button>
                                  </label>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setFieldValue("brochure", "")}
                                    style={{
                                      borderColor: "#ef4444",
                                      color: "#ef4444",
                                      textTransform: "none",
                                      fontSize: "12px"
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </Box>
                          </Box>
                        )}

                        <FormHelperText error>
                          {touched.brochure && errors.brochure}
                        </FormHelperText>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Partner Images
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isSubmitting && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading partner images...
                            </Typography>
                          </Box>
                        )}
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const files = Array.from(e.dataTransfer.files).filter((file) =>
                              file.type.startsWith("image/")
                            );

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
                        >
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
                            style={{ flexDirection: "column", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}
                          >
                            <Avatar>
                              <FiUpload />
                            </Avatar>
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                              Click or Drag & Drop images here
                            </Typography>
                          </label>
                        </Box>

                        <Box display="flex" flexWrap="wrap" mt={2}>
                          {(values.partners || []).map((img, i) => (
                            <Box key={i} style={{ position: "relative" }}>
                              <img
                                src={img}
                                alt={`partner-${i}`}
                                className={classes.previewImage}
                              />
                              {!isView && (
                                <IconButton
                                  size="small"
                                  style={{
                                    position: "absolute",
                                    top: "4px",
                                    right: "4px",
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    color: "#ef4444"
                                  }}
                                  onClick={() => {
                                    const updatedPartners = values.partners.filter((_, index) => index !== i);
                                    setFieldValue("partners", updatedPartners);
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                        </Box>

                        <FormHelperText error>
                          {touched.partners && errors.partners}
                        </FormHelperText>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Listing Information Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <InfoIcon className={classes.sectionIcon} />
                  Listing Information
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Property Type {/* <span className={classes.required}>*</span> */}
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
                        className={classes.textField}
                        disabled={isView}
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
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Listing Type {/* <span className={classes.required}>*</span> */}
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
                        className={classes.textField}
                        disabled={isView}
                      >
                        {["For Sale", "Rent", "Featured", "Sold", "Soon"].map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                      <FormHelperText error>
                        {touched.listingType && errors.listingType}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Availability Status {/* <span className={classes.required}>*</span> */}
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
                        className={classes.textField}
                        disabled={isView}
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
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Location Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <LocationIcon className={classes.sectionIcon} />
                  Location
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Address {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter address"
                        name="address"
                        variant="outlined"
                        value={values.address}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.address && errors.address}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabelArabic}>
                        العنوان {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="address_ar"
                        placeholder="أدخل العنوان"
                        variant="outlined"
                        inputProps={{
                          style: { textAlign: "right" },
                          dir: "rtl",
                          lang: "ar",
                        }}
                        value={values.address_ar}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.address_ar && errors.address_ar}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Latitude {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="latitude"
                        placeholder="Enter latitude"
                        variant="outlined"
                        value={values.latitude}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.latitude && errors.latitude}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Longitude {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="longitude"
                        placeholder="Enter longitude"
                        variant="outlined"
                        value={values.longitude}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.longitude && errors.longitude}
                      </FormHelperText>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Location Preview
                      </Typography>
                      <Box style={{
                        width: "100%",
                        height: "300px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#f9fafb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {values.latitude && values.longitude ? (
                          <Box style={{ width: "100%", height: "100%", position: "relative" }}>
                            {/* Primary: Google Maps */}
                            <iframe
                              src={`https://maps.google.com/maps?q=${values.latitude || 0},${values.longitude || 0}&z=15&output=embed`}
                              width="100%"
                              height="100%"
                              style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Property Location - Google Maps"
                              onError={(e) => {
                                console.log("Google Maps failed, trying OpenStreetMap");
                                // Hide Google Maps and show OpenStreetMap fallback
                                e.target.style.display = "none";
                                const fallback = document.getElementById("openstreetmap-fallback");
                                if (fallback) fallback.style.display = "block";
                              }}
                            />
                            {/* Fallback: OpenStreetMap */}
                            {/* <iframe
                              id="openstreetmap-fallback"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(values.longitude) - 0.01},${parseFloat(values.latitude) - 0.01},${parseFloat(values.longitude) + 0.01},${parseFloat(values.latitude) + 0.01}&layer=mapnik&marker=${values.latitude},${values.longitude}`}
                              width="100%"
                              height="100%"
                              style={{ border: 0, position: "absolute", top: 0, left: 0, display: "none" }}
                              title="Property Location - OpenStreetMap"
                            /> */}
                          </Box>
                        ) : (
                          <Box style={{ textAlign: "center", color: "#6b7280" }}>
                            <Typography variant="body2" style={{ marginBottom: "8px" }}>
                              Enter latitude and longitude to view location
                            </Typography>
                            <Typography variant="caption">
                              The map will appear here once coordinates are provided
                            </Typography>
                          </Box>
                        )}

                        {/* Additional Map Options
                        {values.latitude && values.longitude && (
                          <Box style={{ marginTop: "12px", textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps?q=${values.latitude},${values.longitude}`,
                                  '_blank'
                                );
                              }}
                              style={{
                                marginRight: "8px",
                                fontSize: "12px",
                                padding: "4px 12px"
                              }}
                            >
                              Open in Google Maps
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                window.open(
                                  `https://www.openstreetmap.org/?mlat=${values.latitude}&mlon=${values.longitude}&zoom=15`,
                                  '_blank'
                                );
                              }}
                              style={{
                                fontSize: "12px",
                                padding: "4px 12px"
                              }}
                            >
                              Open in OpenStreetMap
                            </Button>
                          </Box>
                        )} */}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Media Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <ImageIcon className={classes.sectionIcon} />
                  Media
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Images {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isSubmitting && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading property images...
                            </Typography>
                          </Box>
                        )}
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const files = Array.from(e.dataTransfer.files).filter((file) =>
                              file.type.startsWith("image/")
                            );

                            if (!files.length) return;
                            setIsSubmitting(true);

                            const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                            if (uploadedUrls?.length) {
                              setFieldValue("images", [...values.images, ...uploadedUrls]);
                            }

                            setIsSubmitting(false);
                          }}
                        >
                          <input
                            id="image-upload-images"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (!files.length) return;

                              setIsSubmitting(true);

                              const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                              if (uploadedUrls?.length) {
                                setFieldValue("images", [...values.images, ...uploadedUrls]);
                              }

                              setIsSubmitting(false);
                            }}
                          />
                          <label
                            htmlFor="image-upload-images"
                            className="displayCenter"
                            style={{ flexDirection: "column", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}
                          >
                            <Avatar>
                              <FiUpload />
                            </Avatar>
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                              Click or Drag & Drop images here (First image will be Thumbnail)
                            </Typography>
                          </label>
                        </Box>

                        <Box display="flex" flexWrap="wrap" mt={2}>
                          {values.images.map((img, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i}>
                              <Box style={{ position: "relative" }}>
                                <img
                                  src={img}
                                  alt={`preview-${i}`}
                                  className={classes.previewImage}
                                />
                                {i === 0 && (
                                  <Chip
                                    label="Thumbnail"
                                    size="small"
                                    style={{
                                      position: "absolute",
                                      top: "4px",
                                      left: "4px",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      fontSize: "10px"
                                    }}
                                  />
                                )}
                                {!isView && (
                                  <IconButton
                                    size="small"
                                    style={{
                                      position: "absolute",
                                      top: "4px",
                                      right: "4px",
                                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                                      color: "#ef4444"
                                    }}
                                    onClick={() => {
                                      const updatedImages = values.images.filter((_, index) => index !== i);
                                      setFieldValue("images", updatedImages);
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Box>

                        <FormHelperText error>
                          {touched.images && errors.images}
                        </FormHelperText>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Interior Design {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isSubmitting && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading interior design images...
                            </Typography>
                          </Box>
                        )}
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const files = Array.from(e.dataTransfer.files).filter((file) =>
                              file.type.startsWith("image/")
                            );
                            if (!files.length) return;

                            setIsSubmitting(true);
                            const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                            if (uploadedUrls?.length) {
                              setFieldValue("interiorDesign", [...values.interiorDesign, ...uploadedUrls]);
                            }
                            setIsSubmitting(false);
                          }}
                        >
                          <input
                            id="image-upload-interior"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (!files.length) return;

                              setIsSubmitting(true);
                              const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                              if (uploadedUrls?.length) {
                                setFieldValue("interiorDesign", [...values.interiorDesign, ...uploadedUrls]);
                              }
                              setIsSubmitting(false);
                            }}
                          />
                          <label
                            htmlFor="image-upload-interior"
                            className="displayCenter"
                            style={{ flexDirection: "column", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}
                          >
                            <Avatar>
                              <FiUpload />
                            </Avatar>
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                              Click or Drag & Drop Interior Design images
                            </Typography>
                          </label>
                        </Box>

                        <Box display="flex" flexWrap="wrap" mt={2}>
                          {values.interiorDesign.map((img, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i}>
                              <Box style={{ position: "relative" }}>
                                <img
                                  src={img}
                                  alt={`interior-${i}`}
                                  className={classes.previewImage}
                                />
                                {!isView && (
                                  <IconButton
                                    size="small"
                                    style={{
                                      position: "absolute",
                                      top: "4px",
                                      right: "4px",
                                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                                      color: "#ef4444"
                                    }}
                                    onClick={() => {
                                      const updatedImages = values.interiorDesign.filter((_, index) => index !== i);
                                      setFieldValue("interiorDesign", updatedImages);
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Box>

                        <FormHelperText error>
                          {touched.interiorDesign && errors.interiorDesign}
                        </FormHelperText>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Exterior Design {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isSubmitting && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading exterior design images...
                            </Typography>
                          </Box>
                        )}
                        <Box
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px dashed #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const files = Array.from(e.dataTransfer.files).filter((file) =>
                              file.type.startsWith("image/")
                            );
                            if (!files.length) return;

                            setIsSubmitting(true);
                            const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                            if (uploadedUrls?.length) {
                              setFieldValue("exteriorDesign", [...values.exteriorDesign, ...uploadedUrls]);
                            }
                            setIsSubmitting(false);
                          }}
                        >
                          <input
                            id="image-upload-exterior"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (!files.length) return;

                              setIsSubmitting(true);
                              const uploadedUrls = await uploadFiles(files, setIsSubmitting);
                              if (uploadedUrls?.length) {
                                setFieldValue("exteriorDesign", [...values.exteriorDesign, ...uploadedUrls]);
                              }
                              setIsSubmitting(false);
                            }}
                          />
                          <label
                            htmlFor="image-upload-exterior"
                            className="displayCenter"
                            style={{ flexDirection: "column", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}
                          >
                            <Avatar>
                              <FiUpload />
                            </Avatar>
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                              Click or Drag & Drop Exterior Design
                            </Typography>
                          </label>
                        </Box>

                        <Box display="flex" flexWrap="wrap" mt={2}>
                          {values.exteriorDesign.map((img, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i}>
                              <Box style={{ position: "relative" }}>
                                <img
                                  src={img}
                                  alt={`exterior-${i}`}
                                  className={classes.previewImage}
                                />
                                {!isView && (
                                  <IconButton
                                    size="small"
                                    style={{
                                      position: "absolute",
                                      top: "4px",
                                      right: "4px",
                                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                                      color: "#ef4444"
                                    }}
                                    onClick={() => {
                                      const updatedImages = values.exteriorDesign.filter((_, index) => index !== i);
                                      setFieldValue("exteriorDesign", updatedImages);
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Box>

                        <FormHelperText error>
                          {touched.exteriorDesign && errors.exteriorDesign}
                        </FormHelperText>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Virtual Tour (3D Model)
                      </Typography>
                      <Box className={classes.imageUploadBox} style={{ position: "relative" }}>
                        {isLoading && (
                          <Box style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            borderRadius: "8px"
                          }}>
                            <Loader />
                            <Typography variant="body2" style={{ marginTop: "8px", color: "#666" }}>
                              Uploading 3D model...
                            </Typography>
                          </Box>
                        )}
                        {!isView && (
                          <>
                            <input
                              accept=".glb,.gltf"
                              style={{ display: "none" }}
                              id="virtual-tour-upload"
                              type="file"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    setIsLoading(true);
                                    const url = await uploadFileS3(file, setIsLoading);
                                    if (url) setObjectUrl(url);
                                  } catch (err) {
                                    toast.error("3D model upload failed!");
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }
                              }}
                            />
                            <label htmlFor="virtual-tour-upload" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "120px" }}>
                              <Typography variant="body2" color="textSecondary" style={{ textAlign: "center", marginBottom: "8px" }}>
                                Click to upload 3D model (.glb/.gltf)
                              </Typography>
                              <Typography variant="caption" color="textSecondary" style={{ textAlign: "center" }}>
                                Upload .glb or .gltf file for 3D virtual tour
                              </Typography>
                            </label>
                          </>
                        )}

                        {/* 3D Model Preview */}
                        {objectUrl && (
                          <Box style={{ marginTop: "16px" }}>
                            <Typography variant="subtitle2" style={{ marginBottom: "8px" }}>
                              3D Model Preview:
                            </Typography>
                            <Box style={{
                              width: "100%",
                              height: "300px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              overflow: "hidden"
                            }}>
                              <ObjectViewer
                                url={objectUrl}
                                style={{ width: "100%", height: "100%" }}
                              />
                            </Box>
                            {!isView && (
                              <Box style={{ marginTop: "8px", textAlign: "center" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  onClick={() => setObjectUrl("")}
                                >
                                  Remove 3D Model
                                </Button>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Video URL
                      </Typography>
                      <TextField
                        fullWidth
                        name="videoUrl"
                        placeholder="Enter Video URL"
                        variant="outlined"
                        value={values.videoUrl}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.videoUrl && errors.videoUrl}
                      </FormHelperText>
                    </Box>
                  </Grid>

                  {objectUrl && (
                    <Grid item xs={12}>
                      <Box className={classes.fieldGroup}>
                        <Typography className={classes.fieldLabel}>
                          3D Model Preview
                        </Typography>
                        <Box style={{
                          width: "100%",
                          height: "400px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f9fafb"
                        }}>
                          <ObjectViewer modelUrl={objectUrl} />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Floor Plans Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <BuildIcon className={classes.sectionIcon} />
                  Floor Plans
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        Property Floor Plans
                      </Typography>
                      <Typography variant="caption" color="textSecondary" style={{ marginBottom: "16px", display: "block" }}>
                        Upload floor plan images and add descriptions for each floor
                      </Typography>
                    </Box>
                  </Grid>

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
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              setIsSubmitting(true);
                              const uploadedUrl = await uploadFile(file, setIsSubmitting);
                              if (uploadedUrl) {
                                const updatedFloors = [...values.floorPlans];
                                updatedFloors[index].floorPhoto = uploadedUrl;
                                setFieldValue("floorPlans", updatedFloors);
                              }
                              setIsSubmitting(false);
                            }
                          }}
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
                                    setIsSubmitting(true);
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
                                    Click or Drag & Drop Floor Photo
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
                                    setIsSubmitting(true);
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
                          // disabled={values.floorPlans.length === 1}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>

                      {/* RIGHT: Additional Images */}
                      <Box
                        flex={0.6}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "2px dashed #1976d2";
                          e.currentTarget.style.backgroundColor = "#f0f8ff";
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";

                          const files = Array.from(e.dataTransfer.files).filter((file) =>
                            file.type.startsWith("image/")
                          );
                          if (!files.length) return;

                          setIsSubmitting(true);
                          const uploadedImageUrls = [];
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
                      >
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
                            Click or Drag & Drop Additional Images
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
              </Box>

              {/* Bedrooms Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <BuildIcon className={classes.sectionIcon} />
                  Bedrooms
                </Typography>

                <Grid spacing={4}>
                  {values.bedrooms.map((bedroom, index) => (
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
                      {/* LEFT: Bedroom Photo */}
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
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              setIsSubmitting(true);
                              const uploadedUrl = await uploadFile(file, setIsSubmitting);
                              if (uploadedUrl) {
                                const updated = [...values.bedrooms];
                                updated[index].photo = uploadedUrl;
                                setFieldValue("bedrooms", updated);
                              }
                              setIsSubmitting(false);
                            }
                          }}
                        >
                          {!bedroom.photo ? (
                            <>
                              <input
                                id={`bedroom-photo-${index}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setIsSubmitting(true);
                                    const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                    if (uploadedUrl) {
                                      const updated = [...values.bedrooms];
                                      updated[index].photo = uploadedUrl;
                                      setFieldValue("bedrooms", updated);
                                    }
                                    setIsSubmitting(false);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`bedroom-photo-${index}`}
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
                                    Click or Drag & Drop Bedroom Photo
                                  </Typography>
                                </Box>
                              </label>
                            </>
                          ) : (
                            <Box position="relative" width="100%" height="100%">
                              <img
                                src={bedroom.photo}
                                alt={`bedroom-${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                              <input
                                id={`bedroom-photo-${index}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setIsSubmitting(true);
                                    const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                    if (uploadedUrl) {
                                      const updated = [...values.bedrooms];
                                      updated[index].photo = uploadedUrl;
                                      setFieldValue("bedrooms", updated);
                                    }
                                    setIsSubmitting(false);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`bedroom-photo-${index}`}
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

                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<FiTrash2 />}
                            style={{ background: "red", color: "white" }}
                            onClick={() => {
                              const updated = values.bedrooms.filter((_, i) => i !== index);
                              setFieldValue("bedrooms", updated);
                            }}
                          // disabled={values.bedrooms.length === 1}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>

                      {/* RIGHT: Additional Images */}
                      <Box
                        flex={0.6}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "2px dashed #1976d2";
                          e.currentTarget.style.backgroundColor = "#f0f8ff";
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";

                          const files = Array.from(e.dataTransfer.files).filter((file) =>
                            file.type.startsWith("image/")
                          );
                          if (!files.length) return;

                          setIsSubmitting(true);
                          const uploadedUrls = [];
                          for (const file of files) {
                            const uploadedUrl = await uploadFile(file, setIsSubmitting);
                            if (uploadedUrl) uploadedUrls.push(uploadedUrl);
                          }
                          const updated = [...values.bedrooms];
                          updated[index].images = [...(updated[index].images || []), ...uploadedUrls];
                          setFieldValue("bedrooms", updated);
                          setIsSubmitting(false);
                        }}
                      >
                        <input
                          id={`bedroom-images-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            const uploadedUrls = [];
                            setIsSubmitting(true);
                            for (const file of files) {
                              const uploadedUrl = await uploadFile(file, setIsSubmitting);
                              if (uploadedUrl) uploadedUrls.push(uploadedUrl);
                            }
                            const updated = [...values.bedrooms];
                            updated[index].images = [...(updated[index].images || []), ...uploadedUrls];
                            setFieldValue("bedrooms", updated);
                            setIsSubmitting(false);
                          }}
                        />
                        <label
                          htmlFor={`bedroom-images-${index}`}
                          style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          <Avatar>
                            <FiUpload />
                          </Avatar>
                          <Typography variant="body2" mt={1}>
                            Click or Drag & Drop Additional Images
                          </Typography>
                        </label>

                        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                          {(bedroom.images || []).map((img, i) => (
                            <Box
                              key={i}
                              position="relative"
                              width={150}
                              height={150}
                              borderRadius={2}
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
                                  const updated = [...values.bedrooms];
                                  updated[index].images = updated[index].images.filter((_, imgIndex) => imgIndex !== i);
                                  setFieldValue("bedrooms", updated);
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                              <img
                                src={img}
                                alt={`bedroom-image-${index}-${i}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setFieldValue("bedrooms", [...values.bedrooms, { photo: "", images: [] }])
                    }
                  >
                    Add Bedroom
                  </Button>
                </Grid>
              </Box>

              {/* Bathrooms Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <BuildIcon className={classes.sectionIcon} />
                  Bathrooms
                </Typography>

                <Grid spacing={4}>
                  {values.bathrooms.map((bathroom, index) => (
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
                      {/* LEFT: Bathroom Photo */}
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
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "2px dashed #1976d2";
                            e.currentTarget.style.backgroundColor = "#f0f8ff";
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.border = "1px solid #ccc";
                            e.currentTarget.style.backgroundColor = "transparent";

                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) {
                              setIsSubmitting(true);
                              const uploadedUrl = await uploadFile(file, setIsSubmitting);
                              if (uploadedUrl) {
                                const updated = [...values.bathrooms];
                                updated[index].photo = uploadedUrl;
                                setFieldValue("bathrooms", updated);
                              }
                              setIsSubmitting(false);
                            }
                          }}
                        >
                          {!bathroom.photo ? (
                            <>
                              <input
                                id={`bathroom-photo-${index}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setIsSubmitting(true);
                                    const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                    if (uploadedUrl) {
                                      const updated = [...values.bathrooms];
                                      updated[index].photo = uploadedUrl;
                                      setFieldValue("bathrooms", updated);
                                    }
                                    setIsSubmitting(false);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`bathroom-photo-${index}`}
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
                                    Click or Drag & Drop Bathroom Photo
                                  </Typography>
                                </Box>
                              </label>
                            </>
                          ) : (
                            <Box position="relative" width="100%" height="100%">
                              <img
                                src={bathroom.photo}
                                alt={`bathroom-${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                              <input
                                id={`bathroom-photo-${index}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setIsSubmitting(true);
                                    const uploadedUrl = await uploadFile(file, setIsSubmitting);
                                    if (uploadedUrl) {
                                      const updated = [...values.bathrooms];
                                      updated[index].photo = uploadedUrl;
                                      setFieldValue("bathrooms", updated);
                                    }
                                    setIsSubmitting(false);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`bathroom-photo-${index}`}
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

                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<FiTrash2 />}
                            style={{ background: "red", color: "white" }}
                            onClick={() => {
                              const updated = values.bathrooms.filter((_, i) => i !== index);
                              setFieldValue("bathrooms", updated);
                            }}
                          // disabled={values.bathrooms.length === 1}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>

                      {/* RIGHT: Additional Images */}
                      <Box
                        flex={0.6}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "2px dashed #1976d2";
                          e.currentTarget.style.backgroundColor = "#f0f8ff";
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.style.border = "none";
                          e.currentTarget.style.backgroundColor = "transparent";

                          const files = Array.from(e.dataTransfer.files).filter((file) =>
                            file.type.startsWith("image/")
                          );
                          if (!files.length) return;

                          setIsSubmitting(true);
                          const uploadedUrls = [];
                          for (const file of files) {
                            const uploadedUrl = await uploadFile(file, setIsSubmitting);
                            if (uploadedUrl) uploadedUrls.push(uploadedUrl);
                          }
                          const updated = [...values.bathrooms];
                          updated[index].images = [...(updated[index].images || []), ...uploadedUrls];
                          setFieldValue("bathrooms", updated);
                          setIsSubmitting(false);
                        }}
                      >
                        <input
                          id={`bathroom-images-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            const uploadedUrls = [];
                            setIsSubmitting(true);
                            for (const file of files) {
                              const uploadedUrl = await uploadFile(file, setIsSubmitting);
                              if (uploadedUrl) uploadedUrls.push(uploadedUrl);
                            }
                            const updated = [...values.bathrooms];
                            updated[index].images = [...(updated[index].images || []), ...uploadedUrls];
                            setFieldValue("bathrooms", updated);
                            setIsSubmitting(false);
                          }}
                        />
                        <label
                          htmlFor={`bathroom-images-${index}`}
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
                            Click or Drag & Drop Additional Images
                          </Typography>
                        </label>

                        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                          {(bathroom.images || []).map((img, i) => (
                            <Box
                              key={i}
                              position="relative"
                              width={150}
                              height={150}
                              borderRadius={2}
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
                                  const updated = [...values.bathrooms];
                                  updated[index].images = updated[index].images.filter(
                                    (_, imgIndex) => imgIndex !== i
                                  );
                                  setFieldValue("bathrooms", updated);
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                              <img
                                src={img}
                                alt={`bathroom-image-${index}-${i}`}
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
                      </Box>
                    </Box>
                  ))}


                  {/* Add Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setFieldValue("bathrooms", [
                        ...values.bathrooms,
                        { photo: "", images: [] },
                      ])
                    }
                  >
                    Add Bathroom
                  </Button>
                </Grid>
              </Box>

              {/* Tags Section */}
              <Box className={classes.sectionContainer}>
                <Typography className={classes.sectionTitle}>
                  <SeoIcon className={classes.sectionIcon} />
                  Tags
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        SEO Meta Title {/* <span className={classes.required}>*</span> */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="metaTitle"
                        placeholder="Please enter SEO meta titles"
                        variant="outlined"
                        value={values.metaTitle}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.metaTitle && errors.metaTitle}
                      </FormHelperText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.fieldGroup}>
                      <Typography className={classes.fieldLabel}>
                        SEO Meta Tags <span className={classes.required}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="metaTags"
                        placeholder="Please enter SEO meta Tags"

                        variant="outlined"
                        value={values.metaTags}
                        onChange={handleChange}
                        className={classes.textField}
                        disabled={isView}
                      />
                      <FormHelperText error>
                        {touched.metaTags && errors.metaTags}
                      </FormHelperText>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    window.history.back();
                  }}
                  className={classes.backButton}
                  disabled={isSubmitting}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  className={classes.submitButton}
                  disabled={isSubmitting}
                  onClick={() => {
                    const keys = Object.keys(errors);

                    if (keys.length > 0) {
                      const firstKey = keys[0];
                      const firstError = errors[firstKey];

                      let firstErrorMessage = "";

                      if (typeof firstError === "string") {
                        firstErrorMessage = firstError;
                      } else if (typeof firstError === "object" && firstError !== null) {
                        // Try to extract nested message (array or object)
                        const nestedKey = Object.keys(firstError)[0];
                        const nestedValue = firstError[nestedKey];

                        if (typeof nestedValue === "string") {
                          firstErrorMessage = nestedValue;
                        } else if (Array.isArray(nestedValue)) {
                          // Handle array of objects, like floorPlans[0].images
                          const inner = nestedValue?.[0];
                          if (typeof inner === "string") {
                            firstErrorMessage = inner;
                          } else if (typeof inner === "object") {
                            const deepKey = Object.keys(inner || {})[0];
                            firstErrorMessage = inner?.[deepKey];
                          }
                        }
                      }

                      // Fallback if no clean message found
                      if (!firstErrorMessage) {
                        firstErrorMessage = "Please check the form for errors.";
                      }

                      toast.error(firstErrorMessage);
                    }
                  }}



                >
                  {isSubmitting ? "Processing..." : (state?.edit ? "Update Property" : "Create Property")}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddProperty;