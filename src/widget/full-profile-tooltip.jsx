import React from "react";
import { Tooltip } from "react-tooltip";

const FullProfile = ({ tooltipRef }) => (
  <Tooltip
    ref={tooltipRef}
    id="fullProfile"
    place="right-start"
    offset={10}
    opacity={1}
    style={{ zIndex: 2 }}
  />
);

export default FullProfile;
