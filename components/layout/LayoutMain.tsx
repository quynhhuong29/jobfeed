import React from "react";
import { Inter } from "next/font/google";
import Topbar from "./LayoutTopbar";
import BackToTopButton from "../BackToTopButton";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface ILayoutMainProps {
  children: React.ReactNode;
}

const LayoutMain = ({ children }: ILayoutMainProps) => {
  return (
    <div className={inter.className}>
      <Topbar />
      {children}
      <BackToTopButton />
    </div>
  );
};

export default LayoutMain;
