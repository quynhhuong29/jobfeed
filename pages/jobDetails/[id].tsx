/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import FooterAlt from "@/components/FooterAlt";
import {
  BookMarkIcon,
  FacebookIcon,
  GlobalIcon,
  HeartIcon,
  HistoryIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TwitterIcon,
  USDCircleIcon,
  UserIcon,
} from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import { submitCV } from "@/redux/apis/submitCvAPI";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import { getInfoJobAsync, selectJob } from "@/redux/reducers/jobReducers";
import { useAppDispatch } from "@/redux/store";
import { formatMoney } from "@/utils/number.util";
import { filePdfUpload } from "@/utils/upload.util";
import { ArrowForwardIcon, ChevronRightIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import dateFormat from "dateformat";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function jobDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [showButton, setShowButton] = useState(true);
  const [resume, setResume] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const job = useSelector(selectJob);
  const auth = useSelector(selectAuth);

  const handleSendResume = async () => {
    let file: any = "";
    if (
      !job &&
      !job.infoJob &&
      !job.infoJob._id &&
      !job.infoJob.company_info._id
    )
      return;

    setIsLoading(true);
    if (resume) {
      file = await filePdfUpload(resume);
    }

    try {
      await submitCV({
        idJob: job.infoJob._id,
        idCompany: job.infoJob.company_info._id,
        resumeFile: file,
        dateSubmit: new Date().toISOString(),
      });

      toast.success("Submit CV successfully!");
      onClose();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err?.response?.data?.msg) {
        toast.error(err?.response?.data?.msg);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleSavedJob = () => {};

  useEffect(() => {
    if (!router.query.id) return;
    dispatch(getInfoJobAsync(router.query.id.toString()));
  }, [dispatch, router.query.id]);

  useEffect(() => {
    if (auth?.role === "company") setShowButton(false);
  }, [auth?.role]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Job details</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-20">
        {job?.isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green"
              size="xl"
            />
          </div>
        ) : (
          <div className="md:max-w-[1140px] mx-auto grid grid-cols-3 gap-5">
            <div className="col-span-2 border border-gray-300 rounded-lg p-6 h-fit">
              <div className="flex flex-col items-start justify-start pb-4">
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
              <div className="grid grid-cols-3 gap-2">
                {job?.infoJob?.working_experience?.isRequired && (
                  <div className="border border-gray-300 p-4">
                    <p className="text-xs text-gray-600">Experience</p>
                    <p className="text-sm text-gray-700 font-medium">
                      {job?.infoJob?.working_experience?.from} -{" "}
                      {job?.infoJob?.working_experience?.to} Years
                    </p>
                  </div>
                )}
                <div className="border border-gray-300 p-4">
                  <p className="text-xs text-gray-600">Employee type</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {job?.infoJob?.employment_type}
                  </p>
                </div>
                <div className="border border-gray-300 p-4">
                  <p className="text-xs text-gray-600">Position</p>
                  <p className="text-sm text-gray-700 font-medium">
                    {job?.infoJob?.level}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Job Description
                </h5>
                <p className="mt-6 mb-4 text-gray-600 text-base">
                  {job?.infoJob?.job_description}
                </p>
              </div>
              <div className="mt-6">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Job Requirements
                </h5>
                {job?.infoJob?.job_requirement
                  ?.split("\n")
                  ?.map((ele, index) => (
                    <div
                      className="flex items-center gap-2 mt-6 mb-4"
                      key={index}
                    >
                      <div className="w-2 h-2 border border-green-50 rounded-full">
                        &nbsp;
                      </div>
                      <p className=" text-gray-600 text-base">{ele}</p>
                    </div>
                  ))}
              </div>
              <div className="mt-6">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Benefit
                </h5>
                {job?.infoJob?.benefit?.split("\n")?.map((ele, index) => (
                  <div
                    className="flex items-center gap-2 mt-6 mb-4"
                    key={index}
                  >
                    <div className="w-2 h-2 border border-green-50 rounded-full">
                      &nbsp;
                    </div>
                    <p className=" text-gray-600 text-base">{ele}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Offer Salary
                </h5>

                <p className=" text-gray-600 text-base">
                  {" "}
                  {formatMoney(
                    Number(job?.infoJob?.salary?.min),
                    job?.infoJob?.salary?.money_type
                  )}
                  -
                  {formatMoney(
                    Number(job?.infoJob?.salary?.max),
                    job?.infoJob?.salary?.money_type
                  )}
                  /month
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="border border-gray-300 rounded-lg p-6 h-fit">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Job Overview
                </h5>
                <div className="flex items-center gap-4">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <UserIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Job Title
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.job_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <USDCircleIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Experience
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.working_experience?.isRequired ? (
                        <>
                          {job?.infoJob?.working_experience?.from} -{" "}
                          {job?.infoJob?.working_experience?.to} Years{" "}
                        </>
                      ) : (
                        <>Not required</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <MapPinIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Location
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.working_location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <USDCircleIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Offered Salary
                    </h6>
                    <p className="text-base text-gray-800">
                      {formatMoney(
                        Number(job?.infoJob?.salary?.min),
                        job?.infoJob?.salary?.money_type
                      )}
                      -
                      {formatMoney(
                        Number(job?.infoJob?.salary?.max),
                        job?.infoJob?.salary?.money_type
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <HistoryIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Date posted
                    </h6>
                    <p className="text-base text-gray-800">
                      {dateFormat(job?.infoJob?.updatedAt, "dd/mm/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <HistoryIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Expires on
                    </h6>
                    <p className="text-base text-gray-800">
                      {dateFormat(job?.infoJob?.expiring_date, "dd/mm/yyyy")}
                    </p>
                  </div>
                </div>
                {showButton && (
                  <div className="flex flex-col gap-3">
                    <Button
                      colorScheme="green"
                      w="100%"
                      marginTop="24px"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={onOpen}
                      sx={{
                        backgroundColor: "#02af74",
                        color: "#fff",
                        transition: "all .5s ease",
                        "&:hover": {
                          backgroundColor: "#029563",
                          transform: "translateY(-6px)",
                        },
                      }}
                    >
                      Apply Now
                    </Button>
                    <Button
                      colorScheme="yellow"
                      w="100%"
                      marginTop="8px"
                      onClick={handleSavedJob}
                      sx={{
                        backgroundColor: "rgba(247,204,83,.15)",
                        color: "#f7cc53",
                        transition: "all .5s ease",
                        "&:hover": {
                          backgroundColor: "#f7cc53",
                          color: "#fff",
                          transform: "translateY(-6px)",
                          "& svg path": {
                            stroke: "#fff",
                          },
                        },
                      }}
                      leftIcon={
                        <BookMarkIcon
                          fill="transparent"
                          width="16px"
                          height="20px"
                          sx={{
                            "& path ": {
                              stroke: "#f7cc53",
                            },
                          }}
                        />
                      }
                    >
                      Save Job
                    </Button>
                  </div>
                )}
              </div>
              <div className="border border-gray-300 rounded-lg p-6 h-fit">
                <h5 className="mb-4 text-gray-700 font-bold text-lg">
                  Contact Information
                </h5>
                <div className="flex items-center gap-4">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <UserIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Contact Name
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.contact_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <PhoneIcon
                      fill="#02af74"
                      width="20px"
                      height="20px"
                      sx={{
                        "& path ": {
                          stroke: "#02af74",
                        },
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Contact Phone
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.contact_phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <MapPinIcon fill="#02af74" width="20px" height="20px" />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Contact Address
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.contact_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center w-[46px] h-[46px] justify-center rounded-full p-2 bg-[rgba(2,175,116,.15)]">
                    <MailIcon
                      width="20px"
                      height="20px"
                      sx={{
                        "& polyline": {
                          stroke: "#02af74",
                        },
                        "& rect": {
                          stroke: "#02af74",
                        },
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Contact Email
                    </h6>
                    <p className="text-base text-gray-800">
                      {job?.infoJob?.contact_email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg p-6 h-fit">
                <div className="rounded-lg w-full flex items-center justify-center">
                  <img
                    src={job?.infoJob?.company_info?.logo}
                    alt="logo"
                    className="w-14 h-14 rounded-lg"
                  />
                </div>
                <h5 className="mb-4 mt-6 text-gray-700 font-bold text-lg text-center">
                  {job?.infoJob?.company_info?.companyName}
                </h5>
                <div className="flex items-center gap-4 mt-6">
                  <PhoneIcon
                    fill="#02af74"
                    width="20px"
                    height="20px"
                    sx={{
                      "& path ": {
                        stroke: "#02af74",
                      },
                    }}
                  />
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Phone
                    </h6>
                    <p className="text-sm text-gray-800">
                      {job?.infoJob?.company_info?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <MapPinIcon fill="#02af74" width="20px" height="20px" />
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Address
                    </h6>
                    <p className="text-sm text-gray-800">
                      {job?.infoJob?.company_info?.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <GlobalIcon width="20px" height="20px" />
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Website
                    </h6>
                    <p className="text-sm text-gray-800">
                      {job?.infoJob?.company_info?.website}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <MailIcon
                    width="20px"
                    height="20px"
                    sx={{
                      "& polyline": {
                        stroke: "#02af74",
                      },
                      "& rect": {
                        stroke: "#02af74",
                      },
                    }}
                  />
                  <div>
                    <h6 className="text-sm text-gray-700 font-semibold">
                      Email
                    </h6>
                    <p className="text-sm text-gray-800">
                      {job?.infoJob?.company_info?.email}
                    </p>
                  </div>
                </div>
                <Button
                  colorScheme="green"
                  w="100%"
                  marginTop="26px"
                  leftIcon={<ViewIcon color="#fff" />}
                  onClick={() => {}}
                  sx={{
                    backgroundColor: "#02af74",
                    color: "#fff",
                    transition: "all .5s ease",
                    "&:hover": {
                      backgroundColor: "#029563",
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        )}
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
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply For This Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div className="mb-3">
                <label className="text-base mb-2 inline-block">
                  Resume Upload
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(event: any) => setResume(event.target.files)}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleSendResume}
              isLoading={isLoading}
            >
              Send Application
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </LayoutMain>
  );
}

export default jobDetails;
