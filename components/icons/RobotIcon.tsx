import { IconProps, Icon } from "@chakra-ui/react";

export default function RobotIcon(props: IconProps) {
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
        d="m16.2 4.7l.7-1.2c.2-.5.1-1.1-.4-1.4c-.5-.2-1.1-.1-1.4.4l-.6 1.1c.6.2 1.2.6 1.7 1.1zm-8.4 0c.5-.5 1-.8 1.7-1.1l-.6-1.1c-.3-.5-.9-.6-1.4-.4s-.6.9-.4 1.4l.7 1.2zM6 9h12v2H6z"
      ></path>
      <path
        fill="currentColor"
        d="M12 3C8.7 3 6 5.7 6 9h12c0-3.3-2.7-6-6-6zm9 6c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1v-4c0-.6-.4-1-1-1zM3 9c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1v-4c0-.6-.4-1-1-1zm3 8c0 .6.4 1 1 1h2v3c0 .6.4 1 1 1s1-.4 1-1v-3h2v3c0 .6.4 1 1 1s1-.4 1-1v-3h2c.6 0 1-.4 1-1v-6H6v6z"
        opacity=".5"
      ></path>
    </Icon>
  );
}
