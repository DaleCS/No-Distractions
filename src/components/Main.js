import React, { Fragment } from "react";

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
  Tabs,
  Tab,
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
  defaultTabs: {
    color: "#DFE6E9",
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

  const handleOnClickModeChange = (e, newMode) => {
    e.preventDefault();
    switch (newMode) {
      case 0: {
        switchBlockMode("BLACKLIST", setBlockMode);
        break;
      }
      case 1: {
        switchBlockMode("WHITELIST", setBlockMode);
        break;
      }
      default: {
      }
    }
  };

  const redirectToList = (e) => {
    e.preventDefault();
    redirectPath("/list");
  };

  const decodeModeToTab = () => {
    switch (blockMode) {
      case "BLACKLIST": {
        return 0;
      }
      case "WHITELIST": {
        return 1;
      }
      default: {
      }
    }
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
            {blockMode.length === 0 ? (
              <Fragment />
            ) : (
              <Tabs
                value={decodeModeToTab()}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleOnClickModeChange}
              >
                <Tab label="BLACKLIST" className={classes.defaultTabs} />
                <Tab label="WHITELIST" className={classes.defaultTabs} />
              </Tabs>
            )}
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
