import { IconProps, Icon } from "@chakra-ui/react";

export default function TechnologyIcon(props: IconProps) {
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
      <rect
        width="20"
        height="15"
        x="2"
        y="3"
        fill="currentColor"
        opacity=".5"
        rx="3"
      ></rect>
      <path
        fill="currentColor"
        d="M16 21H8a1 1 0 0 1-.832-1.555l4-6a1.038 1.038 0 0 1 1.664 0l4 6A1 1 0 0 1 16 21Z"
      ></path>
    </Icon>
  );
}
