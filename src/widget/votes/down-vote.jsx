import React from "react";

const defaultStyle = {};

const ArrowDown = ({ style = defaultStyle }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    style={{ ...style, transform: "scaleY(-1)" }}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M10 20h4V10h3l-5-6.5L7 10h3v10Z" />
  </svg>
);

export default ArrowDown;
