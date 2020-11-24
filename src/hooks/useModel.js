import React, { useEffect, useReducer } from "react";

import { ACTIVATE_BLOCKER, DEACTIVATE_BLOCKER } from "./constants";
import { getModel, getModelBlockerStatus } from "../services/requests";

const initialState = {
  fetchStatus: "LOADING",
  isActive: false,
  mode: "BLACKLIST",
};

const reducer = (state, action) => {
  switch (action) {
    case "ACTIVATE_BLOCKER": {
      return { ...state, isActive: true };
    }
    case "DEACTIVATE_BLOCKER": {
      return { ...state, isActive: false };
    }
    case "SET_BLACKLIST_MODE": {
      return { ...state, mode: "BLACKLIST" };
    }
    case "SET_WHITELIST_MODE": {
      return { ...state, mode: "WHITELIST" };
    }
    case "LOADING_MODEL": {
      return { ...state, fetchStatus: "LOADING" };
    }
    case "MODEL_LOAD_COMPLETE": {
      return { ...state, fetchStatus: "COMPLETE" };
    }
    case "ERROR_LOADING_MODEL": {
      return { ...state, fetchStatus: "ERROR" };
    }
  }
};

const useModel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getModel(dispatch);
    if (state.fetchStatus.localeCompare("LOADING") != 0) {
      if (getModelBlockerStatus()) {
        dispatch(ACTIVATE_BLOCKER);
      } else {
        dispatch(DEACTIVATE_BLOCKER);
      }
    }
  }, [state.fetchStatus]);

  return { state, dispatch };
};

export default useModel;
