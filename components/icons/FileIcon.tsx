import { IconProps, Icon } from "@chakra-ui/react";

export default function FileIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="#74788d"
      width="20px"
      height="20px"
      viewBox="0 0 32 32"
      version="1.1"
      {...props}
    >
      <path d="M4 30.016q0 0.832 0.576 1.408t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.408v-22.016l-8-8h-13.984q-0.832 0-1.44 0.608t-0.576 1.408v28zM8 28v-24h10.016v6.016h5.984v17.984h-16z" />
    </Icon>
  );
}
