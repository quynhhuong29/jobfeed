import React from "react";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import Link from "next/link";

interface Props {
  children?: React.ReactNode;
  user?: any;
  border?: string;
  handleClose?: () => void;
  setShowFollowers?: (value: boolean) => void;
  setShowFollowing?: (value: boolean) => void;
  msg?: boolean;
  userAuth?: any;
  type?: any;
}

const UserCard = ({
  children,
  user,
  border,
  handleClose,
  setShowFollowers,
  setShowFollowing,
  msg,
  userAuth,
  type,
}: Props) => {
  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (setShowFollowers) setShowFollowers(false);
    if (setShowFollowing) setShowFollowing(false);
  };

  const showMsg = (user: any) => {
    return (
      <>
        <div style={{ filter: true ? "invert(1)" : "invert(0)" }}>
          {user.text}
        </div>
        {user.media.length > 0 && (
          <div>
            {user.media.length} <i className="fas fa-image" />
          </div>
        )}

        {user.call && (
          <span className="material-icons">
            {user.call.times === 0
              ? user.call.video
                ? "videocam_off"
                : "phone_disabled"
              : user.call.video
              ? "video_camera_front"
              : "call"}
          </span>
        )}
      </>
    );
  };

  return (
    <div className={`flex p-2 items-center justify-between w-full ${border}`}>
      <div>
        <div onClick={handleCloseAll} className="flex items-center">
          <Avatar src={user.avatar} size="big-avatar" />

          <div className="ml-1" style={{ transform: "translateY(-2px)" }}>
            <Link
              className="block hover:underline"
              href={`/profile/${user._id}`}
            >
              {user?.role === "company"
                ? user.firstName
                : user.firstName + " " + user.lastName}
              {user.role === "company" && (
                <i className="ml-1 fas fa-check-circle text-[#007BFF]"></i>
              )}
            </Link>

            <small style={{ opacity: 0.7 }}>
              {
                msg ? showMsg(user) : "" // `${user.firstName} ${user.lastName}`
              }
            </small>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default UserCard;
