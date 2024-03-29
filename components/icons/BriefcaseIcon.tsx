import { IconProps, Icon } from "@chakra-ui/react";

function BriefcaseIcon(props: IconProps) {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24px"
      height="24px"
      fill="#02af74"
      {...props}
    >
      <path d="M 9 3 L 9 4 L 4 4 C 2.9069372 4 2 4.9069372 2 6 L 2 10 L 2 14 L 2 18 C 2 19.093063 2.9069372 20 4 20 L 20 20 C 21.093063 20 22 19.093063 22 18 L 22 14 L 22 10 L 22 6 C 22 4.9069372 21.093063 4 20 4 L 15 4 L 15 3 L 9 3 z M 4 6 L 20 6 L 20 10 L 20 14 L 4 14 L 4 10 L 4 6 z M 12 10 A 1 1 0 0 0 11 11 A 1 1 0 0 0 12 12 A 1 1 0 0 0 13 11 A 1 1 0 0 0 12 10 z M 4 16 L 20 16 L 20 18 L 4 18 L 4 16 z" />
    </Icon>
  );
}

export default BriefcaseIcon;
