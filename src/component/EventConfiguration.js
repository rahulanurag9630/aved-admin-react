import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { apiRouterCall } from "src/ApiConfig/service";
import React, { useEffect, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import toast from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import {
  MenuProps,
  capitalizeFirstLetter,
  getBase64,
  toSpaceSeparated,
} from "src/utils";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { MdDelete } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  Cards: {
    position: "relative",
    "& .MuiIconButton-root": {
      background:
        "linear-gradient(93.34deg, #FF6F37 6.82%, #FF2676 35.9%, #B801AA 68.08%, #7101BC 101.4%)",

      position: "absolute",
      bottom: "5px",
      right: "5px",
    },
    "&  .MuiAvatar-root": {
      marginTop: "44px",
      cursor: "pointer",
      height: "200px",
      display: "flex",
      background: "#2f2e2e",
      alignItems: "center",
      borderRadius: "10px",
      justifyContent: "center",
      width: "100%",
    },
  },
  BoxImg: {
    marginTop: "42px",
    border: "1px dashed rgba(255, 255, 255, 0.15)",
    cursor: "pointer",
    height: "200px",
    display: "flex",
    background: "#101010",
    alignItems: "center",
    borderRadius: "10px",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%",
    "& p": {
      paddingTop: "10px",
    },
    "& h6": {
      color: "#fff",
    },
  },
}));

export default function EventConfiguration({ circuitList }) {
  const classes = useStyles();
  const [autoEventConfi, setAutoEventConfi] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [trackType, setTrackType] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [eventDifficulty, setEventDifficulty] = useState("easy");

  const initialValues = {
    name: autoEventConfi?.name || "",
    fee: autoEventConfi?.price / autoEventConfi?.noOfPlayers || "",
    laps: autoEventConfi?.laps || "",
    noOfPlayers: autoEventConfi?.noOfPlayers || "",
    image: autoEventConfi?.image || "",
    imageFile: autoEventConfi?.image || "",
    description: autoEventConfi?.description || "",
    timeDuration: autoEventConfi?.timeDuration || "",
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("Event name is required."),
    laps: yup
      .number()
      .typeError(`laps must be a number.`)
      .required(`laps is required.`)
      .moreThan(0, `laps must be greater than 0.`)
      .max(3, `laps must be 3 or fewer.`),
    noOfPlayers: yup
      .number()
      .typeError(`Number of participants must be a number.`)
      .required(`Number of participants is required.`)
      .moreThan(0, `Number of participants must be greater than 0.`)
      .max(10, `Number of participants must be 10 or fewer.`),
    image: yup.mixed().required("Event image is required."),
    fee: yup
      .number()
      .typeError(`Entry fee must be a number.`)
      .required(`Entry fee is required.`)
      .moreThan(0, `Entry fee must be greater than 0.`),
    description: yup
      .string()
      .required("Description is required")
      .min(3, "Please enter atleast 3 characters")
      .max(600, "You can enter only 600 characters"),
    timeDuration: yup
      .number()
      .typeError(`Time must be a number.`)
      .required(`Time is required.`)
      .moreThan(0, `Time must be greater than 0.`)
      .integer(`Time must be an integer.`),
  });

  const handleAddEvent = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("_id", autoEventConfi?._id);
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          if (key === "imageFile" || key === "fee") return;
          if (key === "image") {
            formData.append("image", values.imageFile);
          } else {
            formData.append(key, values[key]);
          }
        }
      });
      formData.append(
        "price",
        (parseFloat(values.fee) * Number(values.noOfPlayers)).toString()
      );
      const response = await apiRouterCall({
        endPoint: "updateAutoEventConfiguraton",
        bodyData: formData,
      });
      if (response?.data?.responseCode === 200) {
        toast.success(response?.data?.responseMessage);
      } else {
        toast.error(response?.data?.responseMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (trackType && vehicleType && eventDifficulty) {
      const getEventDataApi = async () => {
        try {
          const response = await apiRouterCall({
            method: "GET",
            endPoint: "autoEventConfiguraton",
            paramsData: {
              circuitId: trackType,
              difficulty: eventDifficulty,
              vehicleType: vehicleType,
            },
            token: localStorage.getItem("token"),
          });
          if (response?.data?.responseCode === 200) {
            setAutoEventConfi(response.data.result);
          } else {
            setAutoEventConfi();
          }
        } catch (error) {
          console.error(error);
        }
      };
      getEventDataApi();
    }
  }, [trackType, vehicleType, eventDifficulty]);

  useEffect(() => {
    if (circuitList?.length > 0) {
      setTrackType(circuitList[0]?._id);
    }
  }, [circuitList]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => handleAddEvent(values)}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
      }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7} md={7} lg={7}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">Track Type</Typography>
                  </Box>
                  <FormControl fullWidth className="formControl">
                    <Select
                      labelId={`select-${trackType}`}
                      id={`select-${trackType}`}
                      value={trackType}
                      onChange={(e) => setTrackType(e.target.value)}
                      name="circuitId"
                      variant="outlined"
                      fullWidth
                      inputProps={{ "aria-label": "Without label" }}
                      disabled={isLoading}
                      MenuProps={MenuProps}
                    >
                      {circuitList.map((data) => (
                        <MenuItem key={data._id} value={data._id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">Vehicle Type</Typography>
                  </Box>
                  <FormControl fullWidth className="formControl">
                    <Select
                      labelId={`select-${vehicleType}`}
                      id={`select-${vehicleType}`}
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      name="vehicleType"
                      variant="outlined"
                      fullWidth
                      inputProps={{ "aria-label": "Without label" }}
                      disabled={isLoading}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="CAR">Car</MenuItem>
                      <MenuItem value="BIKE">Bike</MenuItem>
                      <MenuItem value="HOVERBOARD">Hoverboard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={1} mb={1}>
                    <Typography variant="body2">Difficulty Type</Typography>
                  </Box>
                  <FormControl fullWidth className="formControl">
                    <Select
                      labelId={`select-${eventDifficulty}`}
                      id={`select-${eventDifficulty}`}
                      value={eventDifficulty}
                      onChange={(e) => setEventDifficulty(e.target.value)}
                      name="eventDifficulty"
                      variant="outlined"
                      fullWidth
                      inputProps={{ "aria-label": "Without label" }}
                      disabled={isLoading}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="easy">Basic</MenuItem>
                      <MenuItem value="medium">Pro</MenuItem>
                      <MenuItem value="hard">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {[
                  "name",
                  "noOfPlayers",
                  "laps",
                  "fee",
                  "timeDuration",
                  "description",
                ].map((field) => (
                  <Grid item xs={12} key={field}>
                    <Box mt={1} mb={1}>
                      <Typography variant="body2">
                        {capitalizeFirstLetter(toSpaceSeparated(field))}
                      </Typography>
                    </Box>
                    <FormControl fullWidth className="formControl">
                      {field !== "description" ? (
                        <TextField
                          variant="outlined"
                          placeholder={`Enter ${toSpaceSeparated(field)}`}
                          fullWidth
                          value={values[field]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="text"
                          name={field}
                          error={touched[field] && Boolean(errors[field])}
                          inputProps={{ style: { color: "#fff" } }}
                          disabled={isLoading}
                          InputProps={
                            field === "timeDuration"
                              ? {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      Min
                                    </InputAdornment>
                                  ),
                                }
                              : {}
                          }
                        />
                      ) : (
                        <TextField
                          variant="outlined"
                          placeholder={`Enter ${field}`}
                          fullWidth
                          value={values[field]}
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          type="text"
                          name={field}
                          error={touched[field] && Boolean(errors[field])}
                          inputProps={{ style: { color: "#fff" } }}
                          disabled={isLoading}
                          multiline
                          maxRows={6}
                          rows={4}
                        />
                      )}

                      <FormHelperText error>
                        {touched[field] && errors[field]}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} md={5} lg={5}>
              <Box className={classes.Cards} mt={1}>
                <label htmlFor="raised-button-file3">
                  <figure className="figure" style={{ margin: "0px" }}>
                    {!values.image ? (
                      <Box my={2} className={classes.BoxImg}>
                        <Box mb={1}>
                          <Typography variant="body2">Event Image</Typography>
                        </Box>
                        <Box className={classes.icomButton}>
                          <FiPaperclip
                            style={{
                              color: "#FFFFFF99",
                              fontSize: "25px",
                            }}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Avatar
                        className={classes.imgsection1}
                        src={values.image ? values.image : "images/camera1.png"}
                      />
                    )}
                  </figure>
                </label>
                {values.image && (
                  <IconButton
                    onClick={() => {
                      setFieldValue("image", "");
                      setFieldValue("imageFile", "");
                    }}
                  >
                    <MdDelete style={{ color: "#fff" }} />
                  </IconButton>
                )}
                <input
                  style={{ display: "none" }}
                  id="raised-button-file3"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFieldValue("imageFile", e.target.files[0]);
                    getBase64(e.target.files[0], (result) => {
                      setFieldValue("image", result);
                    });
                  }}
                  disabled={isLoading}
                />
              </Box>
              <FormHelperText error>
                {touched.image && errors.image}
              </FormHelperText>
            </Grid>
          </Grid>
          <Box align="center" mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              Update Event {isLoading && <ButtonCircularProgress />}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
