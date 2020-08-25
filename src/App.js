import React, { useState } from "react";

import { Main, Blacklist, Whitelist, Preferences } from "./components";

import useModelFetchStatus from "./hooks/useModelFetchStatus";

import { makeStyles, Grid, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles({
  size: {
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
  },
});

const App = () => {
  const modelLoadingStatus = useModelFetchStatus();
  const [path, setPath] = useState("/main");

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
        return <Main redirectPath={redirectPath} />;
      }
      case "/blacklist": {
        return <Blacklist redirectPath={redirectPath} />;
      }
      case "/whitelist": {
        return <Whitelist redirectPath={redirectPath} />;
      }
      case "/preferences": {
        return <Preferences redirectPath={redirectPath} />;
      }
      default: {
        return <Main redirectPath={redirectPath} />;
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
