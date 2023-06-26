/* eslint-disable react-hooks/rules-of-hooks */
import FooterAlt from "@/components/FooterAlt";
import {
  BriefcaseIcon,
  FacebookIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/icons";
import JobCard from "@/components/JobCard";
import { LayoutMain } from "@/components/layout";
import Pagination from "@/components/Pagination";
import { PROVINCE_CITY } from "@/constants/jobPost";
import { jobCard, jobListData } from "@/data/homePageData";
import { useDataFetching } from "@/hooks/dataFetchingHook";
import { searchJobs } from "@/redux/apis/jobApi";
import {
  getAllIndustryAsync,
  selectIndustry,
} from "@/redux/reducers/industryReducers";
import { useAppDispatch } from "@/redux/store";
import { Industry } from "@/types/Industry";
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const jobList = () => {
  const { loading, pages, currentPage, setCurrentPage, totalPages } =
    useDataFetching("/jobPost/getAllJob");

  const dispatch = useAppDispatch();

  const [selectedWorkingLocation, setSelectedWorkingLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [dataSearch, setDataSearch] = useState([]);
  const industry = useSelector(selectIndustry);

  useEffect(() => {
    dispatch(getAllIndustryAsync());
  }, [dispatch]);

  const handleSearchJob = async () => {
    setDataSearch([]);
    const result = await searchJobs(
      searchValue || "",
      selectedWorkingLocation || "",
      selectedIndustry || ""
    );
    if (result) {
      setDataSearch(result);
    }
  };

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Job List</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto ">
          <div className="grid grid-cols-4 gap-2">
            <InputGroup size="md">
              <InputLeftElement
                color={"#02af74"}
                // eslint-disable-next-line react/no-children-prop
                children={<BriefcaseIcon />}
              />
              <Input
                placeholder="Job, Company name..."
                value={searchValue || ""}
                size={"md"}
                sx={{
                  backgroundColor: "#fff",
                  fontSize: "14px",
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length <= 0) {
                    setDataSearch([]);
                  }
                  setSearchValue(event.target.value);
                }}
              />
            </InputGroup>
            <Select
              placeholder="Select working location"
              sx={{
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
              value={selectedWorkingLocation || ""}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedWorkingLocation(event.target.value);
              }}
              size={"md"}
            >
              {PROVINCE_CITY.map((ele) => (
                <option value={ele} key={ele}>
                  {ele}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Select industry"
              sx={{
                backgroundColor: "#fff",
                fontSize: "14px",
              }}
              size={"md"}
              value={selectedIndustry || ""}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedIndustry(event.target.value);
              }}
            >
              {industry?.data?.map((ele: Industry) => (
                <option key={ele._id} value={ele._id}>
                  {ele.title}
                </option>
              ))}
            </Select>
            <Button
              leftIcon={<SearchIcon />}
              colorScheme="teal"
              variant="solid"
              w={"100%"}
              size={"md"}
              sx={{
                backgroundColor: "#02af74",
                fontSize: "14px",
              }}
              _hover={{
                backgroundColor: "#028c5d",
              }}
              onClick={handleSearchJob}
            >
              Find Job
            </Button>
          </div>
          <div className="mt-5">
            <h6 className="text-base mb-2 text-gray-700 font-medium">
              Showing all results
            </h6>

            {loading ? (
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
              <>
                <div className="grid grid-cols-2 grid-flow-row gap-5 mt-6">
                  {dataSearch.length <= 0
                    ? pages?.map((ele: any, index: number) => (
                        <JobCard data={ele} key={ele?._id || index} />
                      ))
                    : Array.isArray(dataSearch) &&
                      dataSearch?.map((ele: any, index: number) => (
                        <JobCard data={ele} key={ele?._id || index} />
                      ))}
                </div>
                {dataSearch.length <= 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </LayoutMain>
  );
};

export default jobList;
