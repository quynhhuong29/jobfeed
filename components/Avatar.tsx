import React from "react";
import { useSelector } from "react-redux";

interface AvatarProps {
  src: string;
  size: string;
}

const Avatar = ({ src, size }: AvatarProps) => {
  // const { theme } = useSelector(state => state)
  const theme = true;

  return <img src={src} alt="avatar" className={size} />;
};

export default Avatar;
