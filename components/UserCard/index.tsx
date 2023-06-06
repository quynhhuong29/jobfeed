/* eslint-disable @next/next/no-img-element */
import { User } from "@/types/User";
import FollowButton from "../FollowButton";

interface Props {
  user: User;
  userAuth?: User;
}

const UserCard = ({ user, userAuth }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 cursor-pointer py-2">
        <img
          alt="avatar"
          src={
            user?.avatar ||
            "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
          }
          className="rounded-full w-10 h-10"
        />
        <div className="flex flex-col">
          <p className="text-base text-gray-800">{user?.username || ""}</p>
          <span className="text-xs">{`${user?.firstName} ${user?.lastName}`}</span>
        </div>
      </div>
      {userAuth && <FollowButton user={userAuth} id={user?._id} />}
    </div>
  );
};
export default UserCard;
