// SortAddress.js
import React, { useState } from "react";
import { LuCopy } from "react-icons/lu";
import { IconButton } from "@material-ui/core";
import toast from "react-hot-toast";
import { Check } from "@material-ui/icons";
// import { sortAddress } from ".";

export function sortAddress(add) {
  const sortAdd = `${add?.slice(0, 8)}...`;
  return sortAdd;
}

const SortAddress = ({ address, showFull, isShowEnd }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Copied!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Unable to copy text", err);
      });
  };

  return (
    <div
      style={
        showFull
          ? {}
          : {
              display: "flex",
              alignItems: "center",
              justifyContent: isShowEnd ? "end" : "",
            }
      }
    >
      <span>{showFull ? address : sortAddress(address.toString())}</span>
      <IconButton
        onClick={handleCopyClick}
        style={{
          // marginLeft: "10px",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          height: 0,
          padding: "5px",
          width: "34px",
        }}
        disabled={copied}
      >
        {copied ? (
          <Check style={{ color: "#78e93c", fontSize: "12px" }} />
        ) : (
          <LuCopy style={{ fontSize: "12px" }} />
        )}
      </IconButton>
    </div>
  );
};

export default SortAddress;
