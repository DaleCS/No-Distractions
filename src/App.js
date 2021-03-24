import React, { useState } from "react";

import "./App.css";

import { Main, List, Preferences } from "./components";
import { Loading } from "./components/reusable";
import useModel from "./hooks/useModel";

const App = () => {
  const { state: model, dispatch } = useModel();
  const [path, setPath] = useState("/main");

  function redirectPath(newPath) {
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
  }

  function renderPath() {
    switch (path) {
      case "/main": {
        return <Main redirectPath={redirectPath} model={model} />;
      }
      case "/list": {
        return <List redirectPath={redirectPath} model={model} />;
      }
      case "/preferences": {
        return <Preferences redirectPath={redirectPath} model={model} />;
      }
      default: {
        return <Main redirectPath={redirectPath} model={model} />;
      }
    }
  }

  let renderedPath;
  switch (model.fetchStatus) {
    case "LOADING": {
      renderedPath = <Loading />;
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
  return <div className="app">{renderedPath}</div>;
};

export default App;
