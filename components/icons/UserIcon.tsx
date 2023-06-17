import { IconProps, Icon } from "@chakra-ui/react";

const UserIcon = (props: IconProps) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      width="20px"
      height="20px"
      viewBox="0 0 32 32"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
      </g>
    </Icon>
  );
};

export default UserIcon;
