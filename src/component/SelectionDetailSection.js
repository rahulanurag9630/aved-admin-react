import React, { useContext, useState } from "react";
import { makeStyles, Box, Button, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { apiRouterCall } from "src/ApiConfig/service";
import SliderDataLoader from "./Skeletons/SliderDataLoader";
import ButtonCircularProgress from "./ButtonCircularProgress";
import ConfirmationDialogBox from "./ConfirmationDialogBox";
import { AuthContext } from "src/context/Auth";
import CommenGeragDetails from "./CommenGeragDetails";
import CommonSelectAsset from "./CommonSelectAsset";

const useStyles = makeStyles((theme) => ({
  raceNow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-90px",
    width: "100%",
    maxWidth: "200px",
    [theme.breakpoints.down("md")]: {
      marginTop: "-80px",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "-70px",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: "0px",
    },
  },
}));

function SelectionDetailSection(props) {
  const classes = useStyles();
  const {
    nftListData,
    selectAvatarID,
    isLoading,
    locationData,
    currentIndexValue,
    setCurrentIndex,
    speciData,
  } = props;

  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoading1, setIsLoading1] = useState(false);
  const [practiceRaceModal, setPracticeRaceModal] = useState(false);

  const commonRedirctData = {
    eventId: locationData?.raceData?.eventId,
    userLevel: locationData?.playGameLevel,
    trackName: locationData?.raceData?.circuitId?.name,
    gamePlayType: locationData?.playGameType,
    raceData: locationData?.raceData,
    raceMaxTime: locationData?.raceMaxTime,
  };

  const handlePlayPractice = async () => {
    try {
      setIsLoading1(true);
      const res = await apiRouterCall({
        method: "POST",
        endPoint: "enterEvent",
        bodyData: {
          eventId: locationData?.raceData?.eventId,
          carId: nftListData[currentIndexValue]?._id,
          avatarId: selectAvatarID?._id,
          level: locationData?.playGameLevel,
        },
      });
      if (res) {
        history.push(`/race-time?${locationData?.raceData?.eventId}`, {
          userId: auth?.userData?._id,
          ...commonRedirctData,
        });
      }
      setIsLoading1(false);
    } catch (error) {
      setIsLoading1(false);
      console.log(error);
    }
  };

  return (
    <>
      <Box className={classes.root} style={{ justifyContent: "center" }}>
        <Container maxWidth="lg">
          <Box align="center">
            <CommonSelectAsset
              passProps={{
                nftListData,
                setCurrentIndex,
                currentIndexValue,
              }}
            />
            {nftListData?.length > 0 && (
              <Box className={classes.raceNow}>
                <Button
                  variant="contained"
                  color="primary"
                  className="enterEventresponsive"
                  onClick={() =>
                    locationData?.playGameType === "practice"
                      ? setPracticeRaceModal(true)
                      : history.push({
                          pathname: "/game-lobby",
                          state: {
                            vehicleId: nftListData[currentIndexValue]?._id,
                            avatarId: selectAvatarID?._id,
                            specificationData: speciData,
                            ...commonRedirctData,
                          },
                        })
                  }
                  disabled={isLoading || isLoading1}
                >
                  {isLoading ? (
                    <SliderDataLoader height={30} variant={"text"} width={50} />
                  ) : isLoading1 ? (
                    <ButtonCircularProgress />
                  ) : (
                    "Enter Event"
                  )}
                </Button>
              </Box>
            )}
          </Box>
          <CommenGeragDetails
            commonPropsData={{
              currentIndexValue,
              nftListData,
              locationData,
            }}
          />
        </Container>
        {practiceRaceModal && (
          <ConfirmationDialogBox
            openModal={practiceRaceModal}
            handleClose={() => setPracticeRaceModal(false)}
            heading="Practice Mode"
            description={`Are you sure, you want to enter practice mode at level ${locationData?.playGameLevel}?`}
            HandleConfirm={handlePlayPractice}
            isLoading={isLoading1}
          />
        )}
      </Box>
    </>
  );
}

export default React.memo(SelectionDetailSection);
