import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  test: {
    border: "1px solid black",
  },
});

const App = () => {
  const classes = useStyles();
  return <p className={classes.test}>Hello</p>;
};

export default App;
