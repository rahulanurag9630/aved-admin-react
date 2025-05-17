import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  select: {
    "& .select__control": {
      borderRadius: "10px",
      background: "rgba(255, 255, 255, 0.05)",
      color: "rgba(255, 255, 255, 0.6)", // Font color in select control
      position: "relative",
      border: "none", // Removing default border
      minHeight: "53px", // Set minimum height for select field
    },
    "& .select__control--is-focused": {
      borderColor: "transparent !important", // Remove border on focus
    },
    "& .select__menu": {
      background: "#000", // Dropdown background color
      borderRadius: "10px", // Optional: Add border-radius to dropdown
    },
    "& .select__menu-list": {
      maxWidth: "calc(100% - 32px)",
      minWidth: "16px",
      maxHeight: "calc(100% - 32px)",
      minHeight: "16px",
      overflowX: "hidden",
      overflowY: "auto",
    },
  },
}));

const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "none", // Remove border
    boxShadow: "none", // Remove default box shadow
    minHeight: "53px", // Ensure minimum height for select field
    fontSize: "13px", // Font size for selected text and placeholder
    color: "rgba(255, 255, 255, 0.6)", // Font color for selected text and placeholder
    "&:hover": {
      border: "none", // Ensure border is none on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: "#000", // Dropdown background color
    borderRadius: "10px", // Optional: Add border-radius to dropdown
  }),
  option: (provided, state) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.6)", // Font color for options
    fontSize: "13px", // Font size
    fontFamily: "'Sora', sans-serif", // Font family
    fontWeight: 300, // Font weight
    lineHeight: "30px", // Line height
    paddingTop: "6px", // Padding top
    paddingBottom: "6px", // Padding bottom
    paddingLeft: "15px", // Padding left
    whiteSpace: "nowrap", // Prevent text wrapping
    background: state.isFocused ? "rgba(255, 255, 255, 0.08)" : "#000", // Hover and default background color
    cursor: "pointer", // Cursor style for options
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.6)", // Text color for selected value
    fontSize: "13px", // Font size for selected value
    fontFamily: "'Sora', sans-serif", // Font family
    fontWeight: 300, // Font weight
    lineHeight: "30px", // Line height
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.6)", // Placeholder text color
    fontSize: "13px", // Font size for placeholder
    fontFamily: "'Sora', sans-serif", // Font family
    fontWeight: 300, // Font weight
    lineHeight: "30px", // Line height
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#333", // Background color of selected chips
    padding: "0px 3px 0px 8px", // Padding for selected chips
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.6)", // Text color of selected chips
    fontSize: "13px", // Font size
    fontFamily: "'Sora', sans-serif", // Font family
    fontWeight: 300, // Font weight
    lineHeight: "30px", // Line height
    padding: "0px 3px 0px 8px", // Padding for text inside selected chips
    whiteSpace: "nowrap", // Prevent text wrapping
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    ":hover": {
      backgroundColor: "#555", // Hover background color of the remove button
      color: "rgba(255, 255, 255, 0.6)", // Hover text color of the remove button
    },
  }),
};
function MultiselectComponent({
  value,
  setFieldValue,
  colourOptions,
  onBlur,
  isLoading,
  name,
}) {
  const classes = useStyles();

  return (
    <Select
      value={value}
      onChange={(selectedOptions) => setFieldValue(name, selectedOptions)}
      onBlur={onBlur}
      name={name}
      isMulti // Allow multiple selections
      options={colourOptions} // Options for the select
      classNamePrefix="select" // Prefix for custom styles
      variant="outlined"
      fullWidth
      inputProps={{ "aria-label": "Without label" }}
      className={classes.select}
      styles={customStyles}
      isDisabled={isLoading}
    />
  );
}

export default MultiselectComponent;
