// pages/index.js
import React, { useState } from "react";
import { Box, Grid, Typography, IconButton } from "@material-ui/core";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import SortAddress from "src/utils/SortAddress";
import Popup from "../dynamicPops/Popup";
import SubDetailCard from "./SubDetailCard";

const ResponsiveBox = ({ tableHead, popupTitle, scoreListData = [] }) => {
  return (
    <Box className="customTable">
      {scoreListData &&
        scoreListData?.map((row, rowIndex) => {
          const rowClass = rowIndex % 2 === 0 ? "even" : "odd";
          const barStatusClass =
            row.barStatus === "PENDING"
              ? "pending"
              : row.barStatus === "FAILED"
              ? "fail"
              : "success";

          return (
            <Box className={rowClass}>
              <Box className={barStatusClass} pt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    {tableHead &&
                      tableHead
                        .filter((head) => head?.column === 0 && head?.isMobile)
                        .slice(1)
                        ?.map((head, index) => {
                          return (
                            <StyledBox
                              data={row}
                              srNo={row[tableHead[0].heading]}
                              head={head}
                              index={index}
                              viewMore={[]}
                              tableHead={tableHead}
                              isShow={false}
                              popupTitle={popupTitle}
                            />
                          );
                        })}
                  </Grid>
                  <Grid item xs={4}>
                    {tableHead &&
                      tableHead
                        .filter((head) => head?.column === 1 && head?.isMobile)
                        ?.map((head, index) => {
                          return (
                            <StyledBox
                              data={row}
                              srNo={""}
                              head={head}
                              index={index}
                              viewMore={[]}
                              tableHead={tableHead}
                              isShow={false}
                              popupTitle={popupTitle}
                            />
                          );
                        })}
                  </Grid>
                  <Grid item xs={4}>
                    {tableHead &&
                      tableHead
                        .filter((head) => head?.column === 2 && head?.isMobile)
                        ?.slice(0, -1)
                        .map((head, index) => {
                          return (
                            <StyledBox
                              data={row}
                              srNo={""}
                              head={head}
                              index={index}
                              viewMore={
                                row[tableHead[tableHead.length - 1].heading]
                              }
                              tableHead={tableHead}
                              isShow={true}
                              popupTitle={popupTitle}
                            />
                          );
                        })}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};

const CustomTable = ({ tableHead, scoreListData, popupTitle }) => {
  return (
    <div>
      <ResponsiveBox
        tableHead={tableHead}
        scoreListData={scoreListData}
        popupTitle={popupTitle}
      />
    </div>
  );
};

export default CustomTable;

const StyledBox = ({
  data,
  head,
  srNo,
  index,
  viewMore,
  tableHead,
  isShow,
  popupTitle,
}) => {
  const [open, setOpen] = useState(false);

  const HandleFullView = () => {
    setOpen(!open);
  };

  return (
    <>
      {head?.heading === "Action" ? (
        data[head?.heading]
          .filter((action) => action.isMobile)
          ?.map((action, idx) => (
            <IconButton
              size="small"
              key={idx}
              onClick={action?.onClick}
              disabled={!action?.icon}
              style={{
                padding: "2px",
                width: "22px",
                height: "22px",
              }}
            >
              <MdOutlineKeyboardDoubleArrowRight />
            </IconButton>
          ))
      ) : head?.isCopy ? (
        data[head?.heading] && (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {data[head?.heading] === "N/A" ? (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              ></span>
            ) : (
              <Box textAlign="left">
                <Typography variant="body2" color="primary" display="flex">
                  {srNo && index === 0 ? srNo + ". " : ""}
                  <SortAddress address={data[head?.heading]} />
                </Typography>
              </Box>
            )}
          </Box>
        )
      ) : (
        <Box textAlign="left">
          <Typography
            variant="body2"
            color="primary"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <>
              {srNo && index === 0 ? srNo + ". " : ""}
              {data[head?.heading] || ""}{" "}
            </>
            {head?.heading === "Status" && isShow && (
              <IconButton
                size="small"
                key={"idx"}
                onClick={HandleFullView}
                style={{
                  padding: "2px",
                  width: "22px",
                  height: "22px",
                  "& svg": {
                    color: (theme) => theme.palette.primary.main,
                  },
                }}
              >
                <MdOutlineKeyboardDoubleArrowRight />
              </IconButton>
            )}
          </Typography>
        </Box>
      )}

      {open && (
        <Popup
          open={open}
          handleClose={HandleFullView}
          title={popupTitle ? popupTitle : "View History"}
          actions={
            data?.Action?.length > 0 &&
            data?.Action.filter((data) => data.isMobile).map((data) => {
              return {
                label: data.label,
                onClick: () => {
                  if (data.onClick) {
                    data.onClick();
                  } else {
                    data.onClickIs();
                  }
                },
                color: data.color ? data.color : "primary",
                variant: data.variant ? data.variant : "contained",
                isPermitions: data.isPermitions ? data.isPermitions : false,
                // isLoading: isProcessing,
              };
            })
          }
          titleIcon=""
          isLoading=""
          isRemove=""
        >
          <Box textAlign="left" style={{ padding: "10px" }}>
            {data &&
              Object.entries(data).map(([key, value]) =>
                key === "Plan" ||
                key === "barStatus" ||
                Array.isArray(value) ? null : (
                  <Box display={"flex"} mb={1}>
                    <Typography variant="body2" color="primary" mb={1}>
                      {key} :- &nbsp;
                    </Typography>
                    <Typography
                      variant="body2"
                      color="secondary"
                      mb={1}
                      style={{ wordWrap: "break-word" }}
                    >
                      {value ? (
                        tableHead.find((data) => data.heading === key)
                          ?.isCopy ? (
                          <SortAddress address={value} />
                        ) : (
                          value
                        )
                      ) : (
                        "N/A"
                      )}
                    </Typography>
                  </Box>
                )
              )}
            {data?.Strategy && (
              <Grid container spacing={2}>
                <Grid item lg={12} sm={12} xs={12} md={12}>
                  <Typography variant="h6">Strategy</Typography>
                </Grid>
                {data?.Strategy &&
                  data?.Strategy.map((item, i) => {
                    return (
                      <Grid item lg={12} sm={12} xs={12} md={12}>
                        <SubDetailCard item={item} index={i} />
                      </Grid>
                    );
                  })}
              </Grid>
            )}
          </Box>
        </Popup>
      )}
    </>
  );
};
