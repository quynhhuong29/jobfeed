import { IconProps, Icon } from "@chakra-ui/react";

const DotIcon = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M8 3a5 5 0 100 10A5 5 0 008 3z"></path>
      </g>
    </Icon>
  );
};

export default DotIcon;
