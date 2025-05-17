import MainFilter from "src/component/MainFilter";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import UserNftCard from "./UserNftCard";
import { useHistory } from "react-router-dom";

export default function UserListedNFTs() {
  const cardData = [
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
    {
      text: "Theta Punk-001",
      text1: "1.5 Fiero",
      image: "images/Garage/GarageImage01.png",
    },
  ];
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <MainFilter />
        </Grid>

        {cardData &&
          cardData?.map((data, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <UserNftCard data={data} index={index} />
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}
