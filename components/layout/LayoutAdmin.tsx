import { ChevronRightIcon } from "@chakra-ui/icons";
import { Inter } from "next/font/google";
import Link from "next/link";
import BackToTopButton from "../BackToTopButton";
import FooterAlt from "../FooterAlt";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "../icons";
import LayoutTopBarAdmin from "./LayoutTopBarAdmin";
import SideBar from "./SideBar";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface ILayoutAdmin {
  children: React.ReactNode;
}

const LayoutAdmin = ({ children }: ILayoutAdmin) => {
  return (
    <div className={`${inter.className} min-h-screen`}>
      <LayoutTopBarAdmin />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] min-h-screen">
        <SideBar />
        <div>{children}</div>
      </div>
      <footer className="w-full py-[60px] bg-[#2e3538] text-sm">
        <div className="md:max-w-[1140px] mx-auto grid grid-flow-col grid-cols-6">
          <div className="col-span-2 px-[10px]">
            <h4 className="text-white text-xl mb-6">Jobvia</h4>
            <p className="text-slate-400">
              It is a long established fact that a reader will be of a page
              reader will be of at its layout.
            </p>
            <div>
              <p className="text-white my-4">Follow Us on:</p>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full p-[6px] border border-[rgba(255,255,255,.45)] bg-transparent icon_button"
                >
                  <FacebookIcon
                    width="14px"
                    height="14px"
                    fill="rgba(255,255,255,.45)"
                  />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full p-[6px] border border-[rgba(255,255,255,.45)] bg-transparent icon_button"
                >
                  <LinkedInIcon
                    width="14px"
                    height="14px"
                    fill="rgba(255,255,255,.45)"
                  />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full p-[6px] border border-[rgba(255,255,255,.45)] bg-transparent icon_button"
                >
                  <TwitterIcon
                    width="14px"
                    height="14px"
                    fill="rgba(255,255,255,.45)"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-1 text-base text-slate-400 px-[10px]">
            <p className="text-white mb-6">Company</p>
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> About
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Contact Use
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Services
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Blog
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Team
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Pricing
              </Link>
            </div>
          </div>
          <div className="col-span-1 text-base text-slate-400 px-[10px]">
            <p className="text-white mb-6">For Jobs</p>
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Browser Categories
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Browser Jobs
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Job Details
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Bookmark Jobs
              </Link>
            </div>
          </div>
          <div className="col-span-1 text-base text-slate-400 px-[10px]">
            <p className="text-white mb-6">For Candidates</p>
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Candidate List
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Candidate Grid
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Candidate Details
              </Link>
            </div>
          </div>
          <div className="col-span-1 text-base text-slate-400 px-[10px]">
            <p className="text-white mb-6">Support</p>
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Help Center
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> FAQ&apos;S
              </Link>
              <Link href="/" className="flex items-center hover:text-white">
                <ChevronRightIcon /> Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <FooterAlt />
      <BackToTopButton />
    </div>
  );
};

export default LayoutAdmin;
