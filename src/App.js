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
  const [page, setPage] = useState(
    <Main
      changePage={changePage}
      blockerStatus={{ isBlockerActive, setIsBlockerActive }}
    />
  );

  useEffect(() => {
    getModel(setModelLoadingStatus, setIsBlockerActive);
  }, []);

  const changePage = (path) => {
    switch (path) {
      case "/main": {
        setPage(
          <Main
            changePage={changePage}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
        break;
      }
      case "/blacklist": {
        setPage(
          <Blacklist
            changePage={changePage}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
        break;
      }
      case "/whitelist": {
        setPage(
          <Whitelist
            changePage={changePage}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
        break;
      }
      case "/preferences": {
        setPage(
          <Preferences
            changePage={changePage}
            blockerStatus={{ isBlockerActive, setIsBlockerActive }}
          />
        );
        break;
      }
      default: {
        setPage(<Main changePage={changePage} />);
      }
    }
  };

  const render = () => {
    switch (modelLoadingStatus) {
      case "LOADING": {
        return <CircularProgress />;
      }
      case "COMPLETE": {
        return page;
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
        {render()}
      </Grid>
    </Grid>
  );
};

export default App;
