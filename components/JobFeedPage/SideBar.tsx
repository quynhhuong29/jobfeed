import { User } from "@/types/User";
import { Avatar, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FireIcon, MessengerIcon, SavedIcon } from "../icons";
import HomeIcon from "../icons/HomeIcon";

interface Props {
  user: User;
}

const SideBar = ({ user }: Props) => {
  const router = useRouter();
  return (
    <div className="fixed">
      <div
        className="flex items-center gap-3 hover:bg-gray-300 cursor-pointer rounded-lg p-2 pl-3"
        onClick={() => {
          if (user?._id) router.push(`/profile/${user?._id}`);
        }}
      >
        <WrapItem>
          <Avatar size="sm" name="Avatar" src={user?.avatar || ""} />
        </WrapItem>
        <p className="text-base text-black font-semibold">
          {`${
            user?.role === "company"
              ? user?.firstName
              : user?.firstName + " " + user?.lastName
          }`}
          {user?.role === "company" && (
            <i className="ml-1 fas fa-check-circle text-[#007BFF]"></i>
          )}
        </p>
      </div>
      <div
        className="flex items-center gap-3 hover:bg-gray-300 cursor-pointer rounded-lg p-2 pl-3"
        onClick={() => router.push("/jobfeed")}
      >
        <HomeIcon height="34px" width="34px" fill={"#17A2B8"} />
        <p className="text-base text-black font-semibold">Home</p>
      </div>
      <div className="flex items-center gap-3 hover:bg-gray-300 cursor-pointer rounded-lg p-2 pl-3">
        <FireIcon height="34px" width="34px" />
        <p className="text-base text-black font-semibold">Follow</p>
      </div>
      <div
        className="flex items-center gap-3 hover:bg-gray-300 cursor-pointer rounded-lg p-2 pl-3"
        onClick={() => {
          router.push("/message");
        }}
      >
        <MessengerIcon height="32px" width="32px" />
        <p className="text-base text-black font-semibold">Messenger</p>
      </div>
      <div className="flex items-center gap-3 hover:bg-gray-300 cursor-pointer rounded-lg p-2 pl-3">
        <SavedIcon height="34px" width="34px" />
        <p className="text-base text-black font-semibold">Saved</p>
      </div>
    </div>
  );
};

export default SideBar;
