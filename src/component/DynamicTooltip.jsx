import React from "react";
import { Tooltip } from "@material-ui/core";

const DynamicTooltip = ({ content, children }) => {
  return (
    <Tooltip
      title={content}
      componentsProps={{
        tooltip: {
          sx: {
            padding: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            maxWidth: "300px",
            color: "#344054",
            fontSize: "12px",
          },
        },
      }}
      placement="top"
      arrow // Optional: Add an arrow to the tooltip
    >
      {children}
    </Tooltip>
  );
};

export default React.memo(DynamicTooltip);
