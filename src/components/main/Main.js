import React, { useState, useEffect } from "react";

import {
  syncActivity,
  activateBlocker,
  deactivateBlocker,
} from "../../services/requests";

import {
  makeStyles,
  Grid,
  ButtonGroup,
  Button,
  IconButton,
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles({
  size: {
    flexGrow: 1,
    height: "100%",
    boxSizing: "border-box",
    color: "#ffffff",
  },
  placeholderBox: {
    width: "50px",
    height: "50px",
    border: "1px solid white",
  },
  w80: {
    width: "80%",
  },
  w100: {
    width: "100%",
  },
  w50: {
    width: "50%",
  },
});

const Main = ({
  changePage,
  blockerStatus: { isBlockerActive, setIsBlockerActive },
}) => {
  useEffect(() => {}, []);

  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.size}
      spacing={2}
    >
      <Grid item>
        <div className={classes.placeholderBox} />
      </Grid>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={2}
        item
      >
        <Grid item className={classes.w80}>
          <ButtonGroup color="primary" className={classes.w100}>
            <Button className={classes.w50}>Blacklist</Button>
            <Button className={classes.w50}>Whitelist</Button>
          </ButtonGroup>
        </Grid>
        <Grid item className={classes.w80}>
          {isBlockerActive === false ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.w100}
              onClick={handleOnClickActivate}
            >
              Activate
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              className={classes.w100}
              onClick={handleOnClickDeactivate}
            >
              Deactivate
            </Button>
          )}
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          item
          className={classes.w80}
        >
          <Grid item>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                changePage("/blacklist");
              }}
            >
              <ListIcon fontSize="large" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                changePage("/preferences");
              }}
            >
              <SettingsIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
