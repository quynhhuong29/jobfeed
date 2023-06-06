import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import { MenuProps } from "@/types/Topbar";
import { getItem } from "@/utils/localStorage.util";
import {
  AddIcon,
  BellIcon,
  EditIcon,
  ExternalLinkIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MenuBar from "../MenuBar/MenuBar";

export const menu: MenuProps[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Job Feed",
    link: "/jobfeed",
  },
];

const Menu = dynamic(
  () => import("@chakra-ui/react").then((chakra) => chakra.Menu),
  {
    ssr: false,
  }
);

const Link = dynamic(() => import("next/link").then((Link) => Link), {
  ssr: false,
});

const Topbar = () => {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const username = getItem("username");
  const [userAuth, setUserAuth] = useState<any>();

  // const userAuth = JSON.parse(localStorage.getItem("user")!);

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  console.log(isAuthenticated, username);
  return (
    <div className="bg-white z-[999] sticky top-0 right-0 left-0 shadow-[0_3px_10px_0_rgba(49,64,71,.08)]">
      <div className="max-w-[90%] mx-auto flex items-center justify-between px-3">
        <Link href="/">
          <Image
            src="/assets/images/logo-dark.png"
            width="106"
            height="22"
            alt="logo"
          />
        </Link>
        <MenuBar data={menu} className="mx-auto" />
        <div className="flex items-center">
          <Menu>
            <div className="relative">
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BellIcon color="#314047" w={26} h={26} />}
                variant="ghost"
              />
              <span className="absolute -top-[2px] -right-[2px] bg-red-100 text-xs text-white w-6 h-6 flex items-center justify-center rounded-full border-[2px] border-white">
                3
              </span>
            </div>
            <MenuList>
              <MenuItem icon={<AddIcon />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                New Window
              </MenuItem>
              <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<EditIcon />} command="⌘O">
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>
          <div className="ml-4 text-base font-sans text-gray-800">
            {isAuthenticated && username ? (
              <Menu>
                <MenuButton
                  as={Button}
                  aria-label="Options"
                  variant="ghost"
                  _active={{
                    bg: "transparent",
                  }}
                  _hover={{
                    bg: "transparent",
                  }}
                  className="!text-gray-800 !font-sans !font-medium"
                >
                  Hi, {username}
                </MenuButton>

                <MenuList>
                  <MenuItem>
                    <Link href={`/jobfeed/profile/${userAuth?._id}`}>
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href={"/signout"}>Logout</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Topbar);
