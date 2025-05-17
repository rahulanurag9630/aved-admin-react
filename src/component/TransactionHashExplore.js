import React from "react";
import { Box, IconButton } from "@material-ui/core";
import { NetworkDetails } from "src/constants";
import CopyToClipboard from "react-copy-to-clipboard";
import { sortAddress } from "src/utils";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";

const TransactionHashExplore = ({ item }) => {
  return (
    <Box className="displayAlign">
      <Box
        onClick={() =>
          window.open(`${NetworkDetails[0].blockExplorerUrls[0]}tx/${item}`)
        }
        style={{ cursor: "pointer", textDecoration: "underline" }}
      >
        {sortAddress(item)}
      </Box>
      &nbsp;
      <CopyToClipboard text={item}>
        <IconButton>
          <MdContentCopy
            style={{ cursor: "pointer" }}
            onClick={() => toast.success("Copied")}
          />
        </IconButton>
      </CopyToClipboard>
    </Box>
  );
};

export default TransactionHashExplore;
