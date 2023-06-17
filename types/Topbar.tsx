export interface NavLink {
  name: string;
  link: string;
}

export interface MenuProps {
  link?: string;
  name: string;
  isCompany?: boolean;
  submenu?: NavLink[];
}
