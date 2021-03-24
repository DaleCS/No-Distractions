import React from "react";

import "./Main.css";

const SessionStats = ({ model }) => {
  return (
    <div className="session-stats">
      <div className="session-stats__stat">
        <span className="session-stats__stat-number">
          {model.numOfRedirections}
        </span>
        <span className="session-stats__stat-description">Redirections</span>
      </div>
      <div className="session-stats__stat">
        <span className="session-stats__stat-number">
          {model.numOfActivations}
        </span>
        <span className="session-stats__stat-description">Activations</span>
      </div>
    </div>
  );
};

export default SessionStats;
