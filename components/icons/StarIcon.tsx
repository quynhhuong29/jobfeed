import { IconProps, Icon } from "@chakra-ui/react";

export default function StarIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      width="40px"
      height="40px"
      viewBox="0 0 32 32"
      version="1.1"
      {...props}
    >
      <title>star</title>
      <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z" />
    </Icon>
  );
}
