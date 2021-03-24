import React, { useEffect, useState, useRef } from "react";

import "./Loading.css";

const Loading = () => {
  const [msg, setMsg] = useState("Connecting to background scripts");
  const msgRef = useRef(msg);

  useEffect(() => {
    function msgCallback() {
      if (msgRef.current.length == 35) {
        msgRef.current = "Connecting to background scripts";
      } else {
        msgRef.current += ".";
      }
      setMsg(msgRef.current);
    }

    setInterval(msgCallback, 250);
    return () => {
      clearInterval(msgCallback);
    };
  }, []);

  return (
    <div className="loading-container">
      <span className="loading-msg">{msg}</span>
    </div>
  );
};

export default Loading;
