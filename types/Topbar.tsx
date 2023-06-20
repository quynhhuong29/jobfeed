export interface NavLink {
  name: string;
  link: string;
}

export interface MenuProps {
  link?: string;
  name: string;
  auth: "candidate" | "company" | "notAuth";
  submenu?: NavLink[];
}
