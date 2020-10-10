import React, { useState, useEffect } from "react";

import { getModelBlockerStatus } from "../services/requests";

const useModelBlockerstatus = () => {
  const [isBlockerActive, setIsBlockerActive] = useState(false);

  useEffect(() => {
    setIsBlockerActive(getModelBlockerStatus);
  }, []);

  return { isBlockerActive, setIsBlockerActive };
};

export default useModelBlockerstatus;
