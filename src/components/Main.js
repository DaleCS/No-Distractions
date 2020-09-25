import React, { useState, useEffect } from "react";

import {
  activateBlocker,
  deactivateBlocker,
  switchBlockMode,
} from "../services/requests";

import useModelBlockerStatus from "../hooks/useModelBlockerStatus";
import useModelBlockMode from "../hooks/useModelBlockMode";

import {
  makeStyles,
  Grid,
  Paper,
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
  paper: {
    padding: "16px",
    backgroundColor: "rgb(118, 118, 119, 0.16)",
  },
  activatorBtn: {
    width: "100%",
  },
  iconBtn: {
    backgroundColor: "#55EFC4",
  },
});

const Main = ({ redirectPath }) => {
  const isBlockerActive = useModelBlockerStatus();
  const { blockMode, setBlockMode } = useModelBlockMode();

  const handleOnClickActivate = (e) => {
    e.preventDefault();
    activateBlocker();
  };

  const handleOnClickDeactivate = (e) => {
    e.preventDefault();
    deactivateBlocker();
  };

  const handleOnClickBlacklistMode = (e) => {
    e.preventDefault();
    switchBlockMode("BLACKLIST", setBlockMode);
  };

  const handleOnClickWhitelistMode = (e) => {
    e.preventDefault();
    switchBlockMode("WHITELIST", setBlockMode);
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
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="column" justify="center" spacing={2}>
          <Grid item>
            <ButtonGroup color="primary">
              <Button
                variant={blockMode === "BLACKLIST" ? "contained" : "outlined"}
                onClick={handleOnClickBlacklistMode}
              >
                BLACKLIST
              </Button>
              <Button
                variant={blockMode === "WHITELIST" ? "contained" : "outlined"}
                onClick={handleOnClickWhitelistMode}
              >
                WHITELIST
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={isBlockerActive ? "contained" : "outlined"}
              color={isBlockerActive ? "secondary" : "primary"}
              className={classes.activatorBtn}
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
              <IconButton color="primary">
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
