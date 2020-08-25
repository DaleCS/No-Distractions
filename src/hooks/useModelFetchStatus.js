import React, { useState, useEffect } from "react";

import { getModel } from "../services/requests";

const useModelFetchStatus = () => {
  const [isFetched, setIsFetched] = useState("LOADING");

  useEffect(() => {
    getModel(setIsFetched);
  });

  return isFetched;
};

export default useModelFetchStatus;
