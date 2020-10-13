import React, { Fragment } from "react";

import ModeSelector from "./reusable/ModeSelector";
import { useModelBlockerStatus, useModelBlockMode } from "../hooks";

import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  modelHeaderSpace: {
    padding: "8px"
  },
  modelHeaderFont: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  urlFont: {
    fontSize: "12px"
  },
  surface: {
    width: "100%",
    padding: "4px 0px"
  },
  w100: {
    width: "100%"
  },
  urlContainer: {
    width: "100%",
    border: "1px solid #55EFC4",
    backgroundColor: "rgb(85, 239, 196, 0.06)"
  },
  border1: {
    border: "1px solid red"
  },
  border2: {
    border: "1px solid blue"
  }
});

const classes = useStyles();

const ModelHeader = ({ blockMode }) => {
  const isBlockMode = (
    <Grid container direction="column" justify="center" alignItems="flex-start" className={classes.modelHeaderFont}>
      <Grid item>
        <Typography>Blacklisted URLs</Typography>
      </Grid>
      <Grid item>
        <Typography>Only block listed URLs</Typography>
      </Grid>
    </Grid>
  );
}

const List = () => {
  const { isBlockerActive, setIsBlockerActive } = useModelBlockerStatus();
  const { blockMode, setBlockMode } = useModelBlockMode();

  const isLoaded = (
    <Grid container direction="column" justify="center" alignItems="flex-start" spacing={1}>
      <Grid item className={classes.w100}>
        <Paper className={classes.surface}>
          <Grid container direction="row" justify="center" alignItems="center" className={classes.w100}>
            <Grid item>
              <ModeSelector blockMode={blockMode} setBlockMode={setBlockMode} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item className={classes.w100}>
        <div className={classes.urlContainer}>
          <div className={}>
            <span className={classes.modelHeaderFont}>Blacklist Mode</span>
            <span className={classes.urlFont}>Only block listed URLs</span>
          </div>
        </div>
      </Grid>
    </Grid>
  );

  return (
    <Fragment>
      {blockMode.length !== 0 ? isLoaded : <Fragment />}
    </Fragment>
  )
};

export default List;
