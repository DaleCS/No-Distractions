import React, { useEffect, useState } from "react";

import { getBlacklist, getWhitelist } from "../services/requests";

import ModeSelector from "./reusable/ModeSelector";

import { makeStyles, Grid, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  header: {
    padding: "0.25rem",
    boxSizing: "border-box",
  },
  urlContainer: {
    border: "1px solid #55EFC4",
    backgroundColor: "rgba(85, 239, 196, 0.06)",
    color: "#55EFC4",
    width: "100%",
    padding: 0,
    margin: 0,
    marginBottom: "0.5rem",
    boxSizing: "border-box",
    height: "370px",
    overflowY: "hidden",
  },
  url: {
    color: "#55EFC4",
    borderTop: "1px solid #55EFC4",
    borderBottom: "1px solid #55EFC4",
    backgroundColor: "rgba(85, 239, 196, 0.08)",
    padding: "0.25rem",
    margin: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  border1: {
    border: "1px solid white",
  },
  mb16: {
    marginBottom: "1rem",
  },
  btnContainer: {
    alignSelf: "flex-start",
  },
});

const List = ({ redirectPath, model, dispatch }) => {
  const [urlList, setList] = useState([]);

  useEffect(() => {
    switch (model.mode) {
      case "BLACKLIST": {
        setList(getBlacklist());
        break;
      }
      case "WHITELIST": {
        setList(getWhitelist());
        break;
      }
      default: {
      }
    }
  }, [model.mode]);

  const classes = useStyles();

  const listMarkup = urlList.map((url) => {
    return (
      <Grid item className={classes.url} key={url}>
        <Typography variant="caption">{url}</Typography>
      </Grid>
    );
  });

  let modeDescription = "";
  switch (model.mode) {
    case "BLACKLIST": {
      modeDescription = "Only block listed URLs";
      break;
    }
    case "WHITELIST": {
      modeDescription = "Only listed URLs are allowed";
      break;
    }
    default: {
    }
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      alignContent="stretch"
      className={classes.root}
    >
      <ModeSelector
        mode={model.mode}
        dispatch={dispatch}
        className={classes.mb16}
      />
      <Grid
        container
        item
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        alignContent="stretch"
        className={classes.urlContainer}
      >
        <Grid
          container
          item
          direction="column"
          justify="center"
          alignItems="flex-start"
          alignContent="flex-start"
          className={classes.header}
        >
          <Grid item>
            <Typography variant="body2">{model.mode} MODE</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">{modeDescription}</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          item
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          alignContent="flex-start"
        >
          {listMarkup}
        </Grid>
      </Grid>
      <Grid item className={classes.btnContainer}>
        <Button variant="contained" color="primary">
          BACK
        </Button>
      </Grid>
    </Grid>
  );
};

export default List;
