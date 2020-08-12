import React, { useState, useEffect } from "react";

import Main from "./components/main/Main";
import Blacklist from "./components/blacklist/Blacklist";
import Whitelist from "./components/whitelist/Whitelist";
import Preferences from "./components/preferences/Preferences";

import { getModel } from "./services/requests";

import { makeStyles, Grid, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  size: {
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
  },
});

const App = () => {
  const [isBlockerActive, setIsBlockerActive] = useState(false);
  const [modelLoadingStatus, setModelLoadingStatus] = useState("LOADING");
  const [path, setPath] = useState("/main");

  useEffect(() => {
    getModel(setModelLoadingStatus, setIsBlockerActive);
  }, []);

  const redirectPath = (newPath) => {
    switch (newPath) {
      case "/main": {
        setPath("/main");
        return;
      }
      case "/blacklist": {
        setPath("/blacklist");
        return;
      }
      case "/whitelist": {
        setPath("/whitelist");
        return;
      }
      case "/preferences": {
        setPath("/preferences");
        return;
      }
      default: {
        setPath("/main");
      }
    }
  };

  function renderPathSwitch() {
    switch (path) {
      case "/main": {
        return (
          <Main
            redirectPath={redirectPath}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
      }
      case "/blacklist": {
        return (
          <Blacklist
            redirectPath={redirectPath}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
      }
      case "/whitelist": {
        return (
          <Whitelist
            redirectPath={redirectPath}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
      }
      case "/preferences": {
        return (
          <Preferences
            redirectPath={redirectPath}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
      }
      default: {
        return (
          <Main
            redirectPath={redirectPath}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
      }
    }
  }

  const modelStatusSwitch = () => {
    switch (modelLoadingStatus) {
      case "LOADING": {
        return <CircularProgress />;
      }
      case "COMPLETE": {
        return renderPathSwitch();
      }
      case "ERROR":
      default: {
        return <div>FUCK</div>;
      }
    }
  };

  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="stretch"
      className={classes.size}
    >
      <Grid item xs={12}>
        {modelStatusSwitch()}
      </Grid>
    </Grid>
  );
};

export default App;
