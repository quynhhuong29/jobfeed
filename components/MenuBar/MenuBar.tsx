import { selectAuth } from "@/redux/reducers/authReducers";
import { MenuProps } from "@/types/Topbar";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface IMenu {
  data: MenuProps[];
  className?: string;
}
const MenuBar = ({ data, className = "" }: IMenu) => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [active, setActive] = useState("");

  const menuRef = useRef<any>(null);
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    setActive(path);
  }, [path]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSelectedMenu("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleSelect = (name: string) => {
    setSelectedMenu(name);
  };

  return (
    <div className={`flex items-center ${className}`}>
      {data.map((item, index: number) => {
        if (item.submenu) {
          return (
            <Menu key={index}>
              <MenuButton
                onClick={() => handleSelect(item.name)}
                className={`px-4 py-4 text-sm text-gray-800 uppercase font-sans font-semibold ${
                  selectedMenu === item.name ||
                  item.submenu.find((submenu) => submenu.link === active)
                    ? "text-green-200"
                    : ""
                }`}
              >
                {item.name}{" "}
                <ChevronDownIcon
                  fill={`${
                    selectedMenu === item.name ||
                    item.submenu.find((submenu) => submenu.link === active)
                      ? "text-green-200"
                      : ""
                  }`}
                />
              </MenuButton>
              {item.name === selectedMenu && (
                <MenuList minWidth="240px" ref={menuRef}>
                  {item.submenu.map((submenu: any, index: number) => (
                    <MenuItemOption
                      value={submenu.name}
                      key={`submenu-${index}`}
                    >
                      <Link
                        href={submenu.link}
                        className={`text-sm text-gray-800 ${
                          active === item.link ? "text-green-200" : ""
                        }`}
                      >
                        {submenu.name}
                      </Link>
                    </MenuItemOption>
                  ))}
                </MenuList>
              )}
            </Menu>
          );
        } else {
          return (
            <Link
              href={item.link!}
              key={index}
              className={`px-4 py-4 text-sm text-gray-800 uppercase font-sans font-semibold ${
                active === item.link ? "text-green-200" : ""
              }`}
            >
              {item.name}
            </Link>
          );
        }
      })}
    </div>
  );
};

export default MenuBar;
