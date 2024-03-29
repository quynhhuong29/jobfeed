import { IconProps, Icon } from "@chakra-ui/react";

export default function PictureIcon(props: IconProps) {
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
        d="M13.5 9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z"
        opacity=".25"
      ></path>
      <path
        fill="currentColor"
        d="M19 2H5a3.009 3.009 0 0 0-3 3v8.86l3.88-3.88a3.075 3.075 0 0 1 4.24 0l2.871 2.887l.888-.888a3.008 3.008 0 0 1 4.242 0L22 15.86V5a3.009 3.009 0 0 0-3-3zm-5.5 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3z"
        opacity=".5"
      ></path>
      <path
        fill="currentColor"
        d="M10.12 9.98a3.075 3.075 0 0 0-4.24 0L2 13.86V19a3.009 3.009 0 0 0 3 3h14a3 3 0 0 0 2.16-.92L10.12 9.98z"
      ></path>
      <path
        fill="currentColor"
        d="m22 15.858l-3.879-3.879a3.008 3.008 0 0 0-4.242 0l-.888.888l8.165 8.209c.542-.555.845-1.3.844-2.076v-3.142z"
        opacity=".25"
      ></path>
    </Icon>
  );
}
