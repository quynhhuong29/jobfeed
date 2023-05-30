import { IconProps, Icon } from "@chakra-ui/react";

export default function PopupCategoryIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      className="iconify iconify--uim"
      width="32px"
      height="32px"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      sx={{ color: "rgb(2, 175, 116)" }}
      {...props}
    >
      <path
        fill="currentColor"
        d="M21 2H9a1 1 0 0 0-1 .999V7h8a1 1 0 0 1 1 .999V16h4a1 1 0 0 0 1-.999V3a1 1 0 0 0-.999-1H21z"
        opacity=".25"
      ></path>
      <path
        fill="currentColor"
        d="M3 12h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"
      ></path>
      <path
        fill="currentColor"
        d="M16 7H6a1 1 0 0 0-1 .999V12h6a1 1 0 0 1 1 .999V19h4a1 1 0 0 0 1-.999V8a1 1 0 0 0-.999-1H16z"
        opacity=".5"
      ></path>
    </Icon>
  );
}
