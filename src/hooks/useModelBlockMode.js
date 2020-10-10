import React, { useState, useEffect } from "react";

import { getModelBlockMode } from "../services/requests";

const useModelBlockerstatus = () => {
  const [blockMode, setBlockMode] = useState("");

  useEffect(() => {
    setBlockMode(getModelBlockMode());
  }, []);

  return { blockMode, setBlockMode };
};

export default useModelBlockerstatus;
