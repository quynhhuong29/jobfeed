import { IconProps, Icon } from "@chakra-ui/react";

export default function TeleIcon(props: IconProps) {
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
        d="M17.688 21.744a2.02 2.02 0 0 1-1.242-.427l-4.03-3.122l-2.702 2.983a1 1 0 0 1-1.698-.383l-2.02-6.682l-3.626-1.26a2.042 2.042 0 0 1-.103-3.818L20.187 1.8a2.042 2.042 0 0 1 2.771 2.295L19.695 20.11a2.054 2.054 0 0 1-2.008 1.633Z"
        opacity=".5"
      ></path>
      <path
        fill="currentColor"
        d="M8.973 21.506a1 1 0 0 1-.957-.71l-2.168-7.16a.999.999 0 0 1 .495-1.176L16.91 6.958a1 1 0 0 1 1.17 1.594l-7.084 7.083l-1.044 5.072a1 1 0 0 1-.933.798h-.046Z"
      ></path>
    </Icon>
  );
}
