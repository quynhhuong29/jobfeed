/* eslint-disable @next/next/no-img-element */
import FooterAlt from "@/components/FooterAlt";
import {
  FacebookIcon,
  HeartIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import { getInfoJobAsync, selectJob } from "@/redux/reducers/jobReducers";
import { useAppDispatch } from "@/redux/store";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Avatar, IconButton, WrapItem } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function jobDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const job = useSelector(selectJob);

  useEffect(() => {
    if (!router.query.id) return;
    dispatch(getInfoJobAsync(router.query.id.toString()));
  }, [dispatch, router.query.id]);

  console.log(job?.infoJob);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Job details</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1140px] mx-auto grid grid-cols-3 gap-5">
          <div className="col-span-2 border border-gray-300 rounded-lg p-6 h-fit">
            <div className="flex flex-col items-start justify-start border-b border-gray-300 pb-4">
              <div className="rounded-lg w-[16%]">
                <img
                  src={job?.infoJob?.company_info?.logo}
                  alt="logo"
                  className="w-14 h-14 rounded-lg"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <h5 className="mt-6 text-gray-700 font-semibold text-lg capitalize">
                  {job?.infoJob?.job_title}
                </h5>
                <IconButton
                  aria-label="Like job"
                  icon={
                    <HeartIcon
                      width="20px"
                      height="20px"
                      sx={{
                        "& path": {
                          stroke: "rgba(173,181,189,.55)",
                        },
                      }}
                    />
                  }
                  size="sm"
                  sx={{
                    backgroundColor: "transparent",
                    border: "1px solid #eff0f2",
                    _hover: {
                      backgroundColor: "#da3746",
                      "& svg path": {
                        stroke: "#fff",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg p-6 h-fit"></div>
        </div>
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

export default jobDetails;
