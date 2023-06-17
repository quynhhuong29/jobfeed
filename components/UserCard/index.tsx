/* eslint-disable @next/next/no-img-element */
import { User } from "@/types/User";
import { useRouter } from "next/router";
import FollowButton from "../FollowButton";

interface Props {
  user: User;
  userAuth?: User;
  type?: "followers" | "following";
}

const UserCard = ({ user, userAuth, type }: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-8">
      <div
        className="flex items-center gap-4 cursor-pointer py-2"
        onClick={() => {
          router.push(`/jobfeed/profile/${user?._id}`);
        }}
      >
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
      {userAuth && user?._id !== userAuth._id && (
        <FollowButton user={userAuth} id={user?._id} type={type} />
      )}
    </div>
  );
};
export default UserCard;
