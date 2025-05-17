import React, { useEffect, useState, useRef, useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import { AuthContext } from "src/context/Auth";
import { unitySandCardUrl, webSocketUrl } from "src/ApiConfig/ApiConfig";
import ConfirmationDialogBox from "./ConfirmationDialogBox";
import { capitalizeFirstLetter } from "src/utils";

export default function RaceTime() {
  const location = useLocation();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const currentRef = useRef(null);
  const [showBlinkingText, setShowBlinkingText] = useState(true);
  const [practiceRaceModal, setPracticeRaceModal] = useState(false);

  useEffect(() => {
    if (auth?.userData?._id && location?.state?.eventId) {
      const web = new WebSocket(webSocketUrl);
      try {
        web.onopen = () => {
          const bodyData = {
            requestType: "eventRaceStatus",
            eventId: location?.state?.eventId,
            userId: auth?.userData?._id,
          };
          web.send(JSON.stringify(bodyData));
          web.onmessage = async (event) => {
            if (event.data !== "[object Promise]" && event.data !== "null") {
              let obj = JSON.parse(event.data);
              if (obj?.isComplete) {
                if (location?.state?.gamePlayType === "practice") {
                  !obj?.isQualified
                    ? setPracticeRaceModal(true)
                    : history.push("/practice-race");
                } else {
                  const stateData = {
                    gameStatus: "ended",
                    vehicleType: location?.state?.raceData?.vehicleType,
                  };
                  localStorage.setItem("stateData", JSON.stringify(stateData));
                  history.push({
                    pathname: "/practice-race",
                    state: "ended",
                  });
                }
              }
            }
          };
        };
        return () => {
          web.close();
        };
      } catch (err) {}
    }
  }, [auth?.userData?._id]);

  useEffect(() => {
    const blinkTimer = setTimeout(() => {
      setShowBlinkingText(false);
    }, 30000);
    return () => clearTimeout(blinkTimer);
  }, []);

  const checkHardalFace =
    location?.state?.userLevel <= 3
      ? "easy"
      : location?.state?.userLevel <= 5
      ? "medium"
      : "hard";

  const normalOrPracticeLevel =
    location?.state?.gamePlayType === "practice"
      ? location?.state?.userLevel
      : checkHardalFace === "easy"
      ? 3
      : checkHardalFace === "medium"
      ? 5
      : 7;

  const checkPractice =
    location?.state?.gamePlayType === "practice"
      ? `AsadPractice${capitalizeFirstLetter(
          location?.state?.raceData?.vehicleType
        )}/`
      : `Asad${capitalizeFirstLetter(location?.state?.raceData?.vehicleType)}/`;

  const RaceURl =
    unitySandCardUrl +
    `/${checkPractice}` +
    location?.state?.trackName +
    `/${checkHardalFace}WebGL/index.html?name=`;

  const practiceRaceTime =
    location?.state?.gamePlayType === "practice"
      ? `&maxTime=${location?.state?.raceMaxTime}`
      : "";

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.focus();
    }
  }, []);

  console.log(
    "unityUrl==",
    `${RaceURl}${auth?.userData?._id}&eventid=${location?.state?.eventId}&level=${normalOrPracticeLevel}${practiceRaceTime}`
  );

  return (
    <div>
      <Box
        style={{ display: "flex", flexDirection: "row", borderRadius: "16px" }}
        className="mostly-customized-scrollbar blinking-text-container"
      >
        {showBlinkingText && (
          <Typography variant="body1" className="blinking-text">
            Don't leave & don't close this tab.
          </Typography>
        )}
        <Box>
          {auth?.userData?._id && location?.state?.eventId && (
            <iframe
              src={`${RaceURl}${auth?.userData?._id}&eventid=${location?.state?.eventId}&level=${normalOrPracticeLevel}${practiceRaceTime}`}
              title="race"
              style={{
                width: "100vw",
                height: "100vh",
                border: 0,
              }}
              ref={currentRef}
            ></iframe>
          )}
        </Box>
      </Box>
      {practiceRaceModal && (
        <ConfirmationDialogBox
          openModal={practiceRaceModal}
          handleClose={() => {
            setPracticeRaceModal(false);
            history.push("/practice-race");
          }}
          heading="Oops, you lose!"
          description={`Your race completion time is slower than expected. Better luck next time!`}
          HandleConfirm={() => setPracticeRaceModal(false)}
          isLoading={false}
          type="ended"
        />
      )}
    </div>
  );
}
