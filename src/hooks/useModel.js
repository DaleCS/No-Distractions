import { useEffect, useReducer } from "react";

import { onMessageClosure, getModel } from "../controllers/requests";

const initialState = {
  fetchStatus: "LOADING",
  isActive: false,
  mode: "BLACKLIST",
  currentURL: "",
  redirectURL: "",
  list: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "INITIALIZE_MODEL": {
      return {
        ...state,
        fetchStatus: "COMPLETE",
        isActive: payload.isActive,
        mode: payload.mode,
        currentURL: payload.currentURL,
        redirectURL: payload.redirectURL,
      };
    }
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
    case "POPULATE_LIST": {
      return { ...state, list: payload.list };
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
    onMessageClosure(dispatch);
    getModel();
  }, []);

  return { state, dispatch };
};

export default useModel;
