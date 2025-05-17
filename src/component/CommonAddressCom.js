import { sortAddress } from "src/utils";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { Typography } from "@material-ui/core";

export default function CommonAddressCom({ text }) {
  return (
    <div className="displayStart">
      <Typography
        variant="body2"
        style={{ color: "#475569", fontSize: "12px" }}
      >
        {sortAddress(text)}
      </Typography>
      &nbsp; &nbsp;
      <CopyToClipboard text={text}>
        <FaRegCopy
          size={14}
          style={{ cursor: "pointer" }}
          onClick={() => toast.success("Copied")}
        />
      </CopyToClipboard>
    </div>
  );
}
