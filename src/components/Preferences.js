import React from "react";

const Preferences = ({ redirectPage }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        redirectPage("/main");
      }}
    >
      back
    </button>
  );
};

export default Preferences;
