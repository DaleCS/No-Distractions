import { useEffect, useReducer } from "react";

import {
  ACTIVATE_BLOCKER,
  DEACTIVATE_BLOCKER,
  SET_BLACKLIST_MODE,
  SET_WHITELIST_MODE,
} from "./constants";
import {
  getModel,
  getModelBlockerStatus,
  getModelBlockMode,
} from "../controllers/requests";

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
    if (state.fetchStatus.localeCompare("LOADING") === 0) {
      getModel(dispatch);
    } else {
      if (getModelBlockerStatus()) {
        dispatch(ACTIVATE_BLOCKER);
      } else {
        dispatch(DEACTIVATE_BLOCKER);
      }

      switch (getModelBlockMode()) {
        case "BLACKLIST": {
          dispatch(SET_BLACKLIST_MODE);
          break;
        }
        case "WHITELIST": {
          dispatch(SET_WHITELIST_MODE);
          break;
        }
        default: {
          console.error("ERROR: Could not retrieve block mode");
        }
      }
    }
  }, [state.fetchStatus]);

  return { state, dispatch };
};

export default useModel;
