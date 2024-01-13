import React from "react";

const closeButtonStyle = {
  background: "transparent",
  border: "0",
  cursor: "pointer",
  padding: "0",
  fill: "rgb(146, 156, 165)",
};

const CloseButton = ({ onClick }) => (
  <button type="button" style={closeButtonStyle} onClick={onClick}>
    <svg viewBox="0 0 12 12" height="12px" width="12px" style={closeButtonStyle}>
      <polygon points="7.6 6 12 10.4 10.4 12 6 7.6 1.6 12 0 10.4 4.4 6 0 1.6 1.6 0 6 4.4 10.4 0 12 1.6" style={closeButtonStyle} />
    </svg>
  </button>
);

export default CloseButton;
