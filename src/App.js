import React, { useState } from "react";

import { makeStyles, Grid, CircularProgress } from "@material-ui/core";

import { Main, List, Preferences } from "./components";
import useModel from "./hooks/useModel";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "1rem",
  },
});

const App = () => {
  const { state: model, dispatch } = useModel();
  const [path, setPath] = useState("/main");

  const redirectPath = (newPath) => {
    switch (newPath) {
      case "/main": {
        setPath("/main");
        return;
      }
      case "/list": {
        setPath("/list");
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

  const renderPath = () => {
    switch (path) {
      case "/main": {
        return (
          <Main redirectPath={redirectPath} model={model} dispatch={dispatch} />
        );
      }
      case "/list": {
        return (
          <List redirectPath={redirectPath} model={model} dispatch={dispatch} />
        );
      }
      case "/preferences": {
        return (
          <Preferences
            redirectPath={redirectPath}
            model={model}
            dispatch={dispatch}
          />
        );
      }
      default: {
        return (
          <Main redirectPath={redirectPath} model={model} dispatch={dispatch} />
        );
      }
    }
  };

  let renderedPath;
  switch (model.fetchStatus) {
    case "LOADING": {
      renderedPath = <CircularProgress />;
      break;
    }
    case "COMPLETE": {
      renderedPath = renderPath();
      break;
    }
    case "ERROR":
    default: {
      renderedPath = (
        <div>Something went wrong. Please reload the extension</div>
      );
    }
  }

  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="stretch"
      className={classes.root}
    >
      <Grid item xs={12}>
        {renderedPath}
      </Grid>
    </Grid>
  );
};

export default App;
