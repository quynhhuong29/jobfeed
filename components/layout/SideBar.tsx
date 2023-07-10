import { Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { DashboardIcon, IconPerson } from "../icons";

export type TSidebarLink = {
  title: string;
  icon: JSX.Element;
  path: string;
};
export const sidebarAdminLinks: TSidebarLink[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/admin",
  },
  {
    title: "Users",
    icon: <IconPerson />,
    path: "/admin/users",
  },
  {
    title: "JobsFeed",
    icon: <DashboardIcon />,
    path: "/admin/jobFeed",
  },
];

const SideBar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="px-4 py-6 bg-white z-[99] sticky top-0 left-0 shadow-[0_3px_10px_0_rgba(49,64,71,.08)]">
      {sidebarAdminLinks.map((link) => (
        <SidebarLink
          isActive={pathname === link.path}
          key={link.title}
          link={link}
        ></SidebarLink>
      ))}
    </div>
  );
};

interface ISidebarLinkProps {
  link: TSidebarLink;
  isActive: boolean;
}
function SidebarLink({ link, isActive }: ISidebarLinkProps) {
  return (
    <Link
      href={link.path}
      className={`flex items-center px-6 py-4 text-base font-bold gap-c10 text-gray-800 rounded-xl ${
        isActive ? "bg-green-500 !text-white" : "hover:text-green-500"
      }`}
    >
      <span>{link.icon}</span>
      <span>{link.title}</span>
    </Link>
  );
}

export default SideBar;
