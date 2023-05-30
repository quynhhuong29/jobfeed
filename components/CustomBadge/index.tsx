import { Badge, BadgeProps } from "@chakra-ui/react";
import { FC } from "react";

export type Props = BadgeProps;

const CustomBadge: FC<Props> = ({ className, ...restProps }) => {
  return (
    <Badge
      {...restProps}
      fontWeight="500"
      borderRadius="6px"
      fontSize="13px"
      textTransform="capitalize"
      className={`${className} px-2 py-[6px] capitalize text-[13px] rounded mx-1`}
    />
  );
};

export default CustomBadge;
