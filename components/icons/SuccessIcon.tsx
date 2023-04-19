import { IconProps, Icon } from "@chakra-ui/react";
import React from "react";

function SuccessIcon(props: IconProps) {
  const circleStyle = {
    fill: "#25AE88",
    cx: 25, // Fixed by removing the curly braces
    cy: 25,
    r: 25,
    z: 0, // Fixed by providing a value for the 'z' property
  };

  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Capa_1"
      viewBox="0 0 50 50"
      xmlSpace="preserve"
      {...props}
    >
      <circle style={circleStyle} />
      <polyline
        style={{
          fill: "none",
          stroke: "#FFFFFF",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 10,
        }}
        points="  38,15 22,33 12,25 "
      />
    </Icon>
  );
}

export default SuccessIcon;
