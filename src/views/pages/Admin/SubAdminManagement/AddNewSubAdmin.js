import Topheading from "src/component/TopHeading";
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { sections } from "src/layouts/DashboardLayout/NavBar";
import toast from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";
import { apiRouterCall } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const useStyles = makeStyles(() => ({
  subAdminContatiner: {
    "& p": {
      "& span": {
        color: "#FF4700",
      },
    },
    "& .basicInfoBox": {
      padding: "20px 0px",
    },
    "& .MuiSvgIcon-fontSizeSmall": {
      color: "#071c35",
    },
  },
}));

const validationFormSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Please enter atleast 3 characters.")
    .max(32, "You can enter only 32 characters.")
    .required("Name is required.")
    .matches(
      /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$/g,
      "Please enter name."
    ),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email.")
    .required("Email is required.")
    .max(100, "Should not exceeds 100 characters."),
});
export default function AddNewSubAdmin() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const checkView = location?.state?.viewSubAdmin;
  const [permission, setPermission] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const initialFormValues = {
    name: location?.state?.name || "",
    email: location?.state?.email || "",
  };

  const addSubAdminApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await apiRouterCall({
        method: location?.state?.editSubAdmin ? "PUT" : "POST",
        endPoint: location?.state?.editSubAdmin
          ? "updateSubAdmin"
          : "createSubAdmin",
        bodyData: {
          userId: location?.state?.editSubAdmin
            ? location?.state?._id
            : undefined,
          name: values.name,
          email: values.email.toLocaleLowerCase(),
          permissions: permission,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history.goBack();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (location?.state?.permissions) {
      setPermission(location?.state?.permissions || []);
    }
  }, [location?.state?.permissions]);

  return (
    <Box className={classes.subAdminContatiner}>
      <Topheading heading="Add new sub admin" />
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationFormSchema}
        onSubmit={(values) =>
          permission?.length > 0
            ? addSubAdminApi(values)
            : toast.error("Please select permissions.")
        }
      >
        {({
          errors,
          handleBlur,
          handleChange,
          touched,
          values,
          setFieldValue,
        }) => (
          <Form>
            <Box>
              <Box pb={1}>
                <Typography variant="h6" color="secondary">
                  Basic details
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Typography
                    variant="body2"
                    color="secondary"
                    style={{ marginBottom: "5px" }}
                  >
                    Name <span>*</span>{" "}
                  </Typography>
                  <TextField
                    placeholder="Enter name"
                    variant="outlined"
                    name="name"
                    fullWidth
                    value={values.name}
                    error={Boolean(touched.name && errors.name)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isUpdating || checkView}
                    inputProps={{
                      maxLength: 33,
                    }}
                  />
                  <FormHelperText error>
                    {touched.name && errors.name}
                  </FormHelperText>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <Typography
                    variant="body2"
                    color="secondary"
                    style={{ marginBottom: "5px" }}
                  >
                    Email <span>*</span>{" "}
                  </Typography>
                  <TextField
                    placeholder="Please enter email"
                    variant="outlined"
                    name="email"
                    fullWidth
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={
                      isUpdating || checkView || location?.state?.editSubAdmin
                    }
                    inputProps={{ maxLength: 257 }}
                  />
                  <FormHelperText error>
                    {touched.email && errors.email}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Box className="basicInfoBox">

              </Box>
              <TableContainer>
                <Table className={classes.tableBox}>
                  <TableHead>
                    <TableRow alignItems="center">
                      <TableCell>Sections</TableCell>
                      <TableCell>View</TableCell>
                      <TableCell>Edit</TableCell>




                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sections &&
                      sections.map((data, i) =>
                        data?.items?.map((value, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{value.title}</TableCell>
                              <TableCell>
                                <CheckboxControl
                                  setPermission={setPermission}
                                  permission={permission}
                                  data={value}
                                  checkView={checkView}
                                  isUpdating={isUpdating}
                                  field="name"
                                  label="View"
                                />
                              </TableCell>
                              <TableCell>
                                {value.title !== "Dashboard" && (
                                  <CheckboxControl
                                    setPermission={setPermission}
                                    permission={permission}
                                    data={value}
                                    checkView={checkView}
                                    isUpdating={isUpdating}
                                    field="isEdit"
                                    label="Edit"
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box
              py={3}
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <Button
                variant="contained"
                color="secondary"
                disabled={isUpdating}
                onClick={() => history.goBack()}
              >
                Back
              </Button>

              {!checkView && (
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={isUpdating || checkView}
                >
                  Submit {isUpdating && <ButtonCircularProgress />}
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

const CheckboxControl = ({
  setPermission,
  data,
  permission,
  checkView,
  isUpdating,
  field,
  label,
}) => {
  const currentPermissionIndex = permission.findIndex(
    (element) => element.name === data.title
  );
  const currentPermission = permission[currentPermissionIndex];
  const isChecked = currentPermission ? currentPermission[field] : false;

  const handleCheckboxClick = () => {
    if (field === "name" && !isChecked) {
      setPermission([...permission, { name: data.title }]);
    } else if (!currentPermission) {
      setPermission([...permission, { name: data.title, [field]: true }]);
    } else {
      if (field === "name" && isChecked) {
        setPermission(permission?.filter((val, i) => val.name !== data.title));
      } else {
        setPermission(
          permission.map((element, index) =>
            index === currentPermissionIndex
              ? { ...element, [field]: !element[field] }
              : element
          )
        );
      }
    }
  };

  return (
    <>
      {label && <span>{label}</span>}
      <Checkbox
        size="small"
        sx={{
          "& input": {
            position: "inherit !important",
          },
        }}
        checked={isChecked}
        disabled={isUpdating}
        inputProps={{
          "aria-label": "checkbox with small size",
        }}
        onClick={() => !checkView && handleCheckboxClick()}
        name={field}
      />
    </>
  );
};
