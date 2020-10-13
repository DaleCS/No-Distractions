import React, { Fragment } from "react";

import {
  activateBlocker,
  deactivateBlocker,
} from "../services/requests";

import ModeSelector from "./reusable/ModeSelector";

import useModelBlockerStatus from "../hooks/useModelBlockerStatus";
import useModelBlockMode from "../hooks/useModelBlockMode";

import {
  makeStyles,
  Grid,
  Paper,
  Button,
  IconButton,
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles({
  size: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    color: "#ffffff",
  },
  surface: {
    width: "100%",
    boxSizing: "border-box"
  },
  w100: {
    width: "100%"
  },
  iconBtn: {
    backgroundColor: "#55EFC4",
  },
});

const Main = ({ redirectPath }) => {
  const { isBlockerActive, setIsBlockerActive } = useModelBlockerStatus();
  const { blockMode, setBlockMode } = useModelBlockMode();

  const handleOnClickActivate = (e) => {
    e.preventDefault();
    activateBlocker(setIsBlockerActive);
  };

  const handleOnClickDeactivate = (e) => {
    e.preventDefault();
    deactivateBlocker(setIsBlockerActive);
  };

  const redirectToList = (e) => {
    e.preventDefault();
    redirectPath("/list");
  };

  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.size}
    >
      <Paper elevation={3} className={classes.surface}>
        <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
          <Grid item>
            {blockMode.length === 0 ? (
              <Fragment />
            ) : (
                <ModeSelector blockMode={blockMode} setBlockMode={setBlockMode} />
              )}
          </Grid>
          <Grid item xs={12} className={classes.w100}>
            <Button
              variant={isBlockerActive ? "contained" : "outlined"}
              color={isBlockerActive ? "secondary" : "primary"}
              className={classes.w100}
              onClick={
                isBlockerActive
                  ? handleOnClickDeactivate
                  : handleOnClickActivate
              }
            >
              {isBlockerActive ? "DEACTIVATE" : "ACTIVATE"}
            </Button>
          </Grid>
          <Grid
            container
            item
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <IconButton color="primary" onClick={redirectToList}>
                <ListIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Main;
