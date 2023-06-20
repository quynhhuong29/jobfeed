import FooterAlt from "@/components/FooterAlt";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  AddIcon,
  ChevronRightIcon,
  EditIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { createCVAsync, selectCV } from "@/redux/reducers/cvReducers";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/store";
import CV1Preview from "@/components/CVPreview/CV1Preview";

type FormValues = {
  profileTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  DOB: string;
  country: string;
  languages: any;
  email: string;
  city: string;
  address: string;
  overview: string;
  workExperience: any;
  skill: any;
  education: any;
  hobbies: string;
  linkIn: string;
};

function CVBuilder() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const { state } = router.query;
  const parsedState = state ? JSON.parse(state as string) : null;
  useEffect(() => {
    if (auth && auth?.role !== "candidate") {
      router.push("/");
    }
  }, [auth, router]);
  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">CV Builder Information</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <div className="flex flex-col gap-4">
            <CV1Preview dataResume={parsedState} />
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto"></div>
      </section>
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
    </LayoutMain>
  );
}

export default withAuth(CVBuilder);
