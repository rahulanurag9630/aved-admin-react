import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  Box,
  TextField,
  FormHelperText,
} from "@material-ui/core";

export default function ContactUsModal({
  title,
  desc,
  isLoading,
  open,
  handleClose,
  handleSubmit,
  type,
  filter,
  setFilter,
  status,
  error,
  handleBlur,
  typeContact,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isLoading) {
          handleClose();
        }
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <Box align="center" mb={1}>
          <Typography variant="h4" color="primary" >
            {title}
          </Typography>
        </Box>
        <Box align="center" mb={2}>
          <Typography variant="body2" color="primary" >
            {desc}
          </Typography>
        </Box>
        {status !== "BLOCK" ? (
          <>
            {type == "reason" && (
              <>
                <TextField
                  fullWidth
                  style={{ color: "#000" }}
                  variant="outlined"
                  type="text"
                  multiline
                  className="textField"
                  rows={5}
                  placeholder="Type message..."
                  inputProps={{
                    maxLength: 600,
                  }}
                  value={filter?.reason}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      reason: e.target.value,
                    });
                  }}
                />
                <Box className="displaySpacebetween">
                  <FormHelperText error>{error}</FormHelperText>
                  <Typography
                    variant="body2"
                    textAlign="end"
                    color="secondary"
                    style={{ marginTop: "5px" }}
                  >
                    {filter?.reason?.length}/600
                  </Typography>
                </Box>
              </>
            )}
            {typeContact == "contactUs" && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  multiline
                  className="textField"
                  style={{ color: "#000" }}
                  rows={5}
                  placeholder="Type message..."
                  inputProps={{
                    maxLength: 600,
                  }}
                  value={filter?.reason}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      reason: e.target.value,
                    });
                  }}
                />
                <Box className="displaySpacebetween">
                  <FormHelperText error>{error}</FormHelperText>
                  <Typography
                    variant="body2"
                    textAlign="end"
                    color="secondary"
                    style={{ marginTop: "5px" }}
                  >
                    {filter?.reason?.length}/600
                  </Typography>
                </Box>
              </>
            )}
          </>
        ) : (
          <></>
        )}

        <Box align="center">
          <Button
            disabled={isLoading}
            variant="contained"
            color="secondary"
            onClick={() => {
              if (!isLoading) {
                handleClose();
                // setFilter({
                //   ...filter,
                //   reason: "",
                // });
              }
            }}
          >
            No
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
            style={{ marginLeft: "8px" }}
          >
            {isLoading ? "Loading..." : "Yes"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
