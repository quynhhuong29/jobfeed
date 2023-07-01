/* eslint-disable react/no-children-prop */
import CardHorizontal from "@/components/CardHorizontal";
import DataCard, { DataCardProps } from "@/components/DataCards";
import FooterAlt from "@/components/FooterAlt";
import {
  BriefcaseIcon,
  FacebookIcon,
  HospitalIcon,
  LinkedInIcon,
  PersonIcon,
  PictureIcon,
  PopupCategoryIcon,
  RobotIcon,
  TechnologyIcon,
  TeleIcon,
  TwitterIcon,
  ValiIcon,
} from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import { PROVINCE_CITY } from "@/constants/jobPost";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  ArrowForwardIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jobCard } from "../data/homePageData";

const dataCards: DataCardProps[] = [
  {
    icon: <PopupCategoryIcon />,
    title: "IT & Software",
    subtitle: "2024 Jobs",
  },
  {
    icon: <TechnologyIcon />,
    title: "Technology",
    subtitle: "1250 Jobs",
  },
  {
    icon: <ValiIcon />,
    title: "Government",
    subtitle: "802 Jobs",
  },
  {
    icon: <PersonIcon />,
    title: "Accounting/Finance",
    subtitle: "577 Jobs",
  },
  {
    icon: <HospitalIcon />,
    title: "Construction / Facilities",
    subtitle: "285 Jobs",
  },
  {
    icon: <TeleIcon />,
    title: "Tele-communications",
    subtitle: "492 Jobs",
  },
  {
    icon: <PictureIcon />,
    title: "Design & Multimedia",
    subtitle: "1045 Jobs",
  },
  {
    icon: <RobotIcon />,
    title: "Human Resource",
    subtitle: "1516 Jobs",
  },
];

function Home() {
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const [content, setContent] = useState("");
  const [selectedWorkingLocation, setSelectedWorkingLocation] = useState("");

  useEffect(() => {
    auth?.role === "company"
      ? setContent("candidates")
      : setContent("dream jobs");
  }, [auth?.role]);

  return (
    <LayoutMain>
      <section className="w-full bg-green-100 relative pt-[160px] pb-[140px]">
        <div className="md:max-w-[1140px] mx-auto">
          <div className="flex items-center">
            <div className="px-2.5">
              <div className="mb-6 mr-[9.8rem]">
                <p className="uppercase text-sm mb-2 font-semibold">
                  We have 150,000+ live jobs
                </p>
                <h1 className="mb-4 text-5xl text-gray-700 font-semibold leading-tight">
                  Find your {content || ""} with{" "}
                  <span className="text-green-200">Jobvia</span>
                </h1>
                <p className="text-base text-gray-600 font-light">
                  Find jobs, create trackable resumes and enrich your
                  applications.Carefully crafted after analyzing the needs of
                  different industries.
                </p>
              </div>
              <div className="flex ">
                <div className="flex-1">
                  <InputGroup size="lg">
                    <InputLeftElement
                      color={"#02af74"}
                      children={<BriefcaseIcon />}
                    />
                    <Input
                      placeholder="Job, Company name..."
                      size={"lg"}
                      sx={{
                        border: "none",
                        backgroundColor: "#fff",
                        borderRadius: "8px 0 0 8px",
                        outline: "none",
                        fontSize: "14px",
                      }}
                      _focusVisible={{ border: "none" }}
                    />
                  </InputGroup>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute z-10 text-gray-400 top-3">|</div>
                  <Select
                    placeholder="Select working location"
                    variant="outline"
                    sx={{
                      border: "none",
                      backgroundColor: "#fff",
                      borderRadius: "0",
                      outline: "none",
                      fontSize: "14px",
                    }}
                    _focusVisible={{ border: "none" }}
                    size={"lg"}
                    value={selectedWorkingLocation || ""}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedWorkingLocation(event.target.value);
                    }}
                  >
                    {PROVINCE_CITY.map((ele) => (
                      <option value={ele} key={ele}>
                        {ele}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex-[0.5]">
                  <Button
                    leftIcon={<SearchIcon />}
                    colorScheme="teal"
                    variant="solid"
                    w={"100%"}
                    size={"lg"}
                    sx={{
                      borderRadius: "0 8px 8px 0",
                      backgroundColor: "#02af74",
                      fontSize: "14px",
                    }}
                    _hover={{
                      backgroundColor: "#028c5d",
                    }}
                  >
                    Find Job
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-2.5">
              <div className="mt-5 md:mt-0">
                <Image
                  src="/assets/images/home.png"
                  alt={""}
                  width={652}
                  height={558}
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="w-full relative bg-white py-14">
        <div className="md:max-w-[1140px] mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center px-[10px] inline-block">
              <h3 className="mb-2 text-gray-700 text-3xl font-semibold">
                Browser Jobs Categories
              </h3>
              <p className="text-gray-600 mb-4">
                Post a job to tell us about your project. We&apos;ll quickly
                match you with the right freelancers.
              </p>
            </div>
            <div className="grid grid-cols-4">
              {dataCards.map((item: DataCardProps, index: number) => (
                <DataCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                />
              ))}
            </div>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="solid"
              sx={{
                backgroundColor: "#02af74",
                fontSize: "15px",
                padding: "12px 20px",
                marginTop: "48px",
                fontWeight: "500",
                lineHeight: "22px",
              }}
              _hover={{
                backgroundColor: "#028c5d",
              }}
            >
              Browse All Categories
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-200 py-14">
        <div className="md:max-w-[1140px] mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center px-[10px] inline-block">
              <h3 className="mb-2 text-gray-700 text-3xl font-semibold">
                New & Random Jobs
              </h3>
              <p className="text-gray-600 mb-4">
                Post a job to tell us about your project. We&apos;ll quickly
                match you with the right freelancers.
              </p>
            </div>
            {jobCard?.map((ele: any, index: number) => (
              <CardHorizontal data={ele} key={index} />
            ))}
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="teal"
              variant="solid"
              sx={{
                backgroundColor: "#02af74",
                fontSize: "15px",
                padding: "12px 20px",
                marginTop: "48px",
                fontWeight: "500",
                lineHeight: "22px",
              }}
              _hover={{
                backgroundColor: "#028c5d",
              }}
              onClick={() => router.push("/jobList")}
            >
              View More
            </Button>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
}

export default Home;
