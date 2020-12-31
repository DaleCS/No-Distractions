import { useEffect, useReducer } from "react";

import { getModel } from "../controllers/requests";

const initialState = {
  fetchStatus: "LOADING",
  isActive: false,
  mode: "",
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
    default: {
      return;
    }
  }
};

const useModel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getModel(dispatch);
  }, []);

  return { state, dispatch };
};

export default useModel;
