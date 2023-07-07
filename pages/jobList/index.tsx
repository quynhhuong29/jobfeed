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
import { getListResumes } from "@/redux/apis/resumeAPI";
import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import {
  getAllIndustryAsync,
  selectIndustry,
} from "@/redux/reducers/industryReducers";
import { useAppDispatch } from "@/redux/store";
import { Industry } from "@/types/Industry";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const jobList = () => {
  const { loading, pages, currentPage, setCurrentPage, totalPages } =
    useDataFetching("/jobPost/getAllJob");

  const router = useRouter();
  const { search, location } = router.query;
  const dispatch = useAppDispatch();

  const [selectedWorkingLocation, setSelectedWorkingLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [listResumes, setListResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dataSearch, setDataSearch] = useState([]);
  const industry = useSelector(selectIndustry);
  const isAuthenticated = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(getAllIndustryAsync());
  }, [dispatch]);

  const handleSearchJob = async () => {
    setDataSearch([]);
    setIsLoading(true);
    const result = await searchJobs(
      searchValue || "",
      selectedWorkingLocation || "",
      selectedIndustry || ""
    );
    if (result) {
      setDataSearch(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getListResumes().then((res) => setListResumes(res));
      } catch (err) {
        console.log(err);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (router.query.search) {
          setSearchValue(
            Array.isArray(router.query.search)
              ? router.query.search[0].toString()
              : router.query.search.toString()
          );
        }
        if (router.query.location) {
          setSelectedWorkingLocation(
            Array.isArray(router.query.location)
              ? router.query.location[0].toString()
              : router.query.location.toString()
          );
        }
        if (router.query.industry) {
          setSelectedIndustry(
            Array.isArray(router.query.industry)
              ? router.query.industry[0].toString()
              : router.query.industry.toString()
          );
        }

        if (
          router.query.industry ||
          router.query.location ||
          router.query.search
        ) {
          const result = await searchJobs(
            router.query.search
              ? Array.isArray(router.query.search)
                ? router.query.search[0].toString()
                : router.query.search.toString()
              : "",
            router.query.location
              ? Array.isArray(router.query.location)
                ? router.query.location[0].toString()
                : router.query.location.toString()
              : "",
            router.query.industry
              ? Array.isArray(router.query.industry)
                ? router.query.industry[0].toString()
                : router.query.industry.toString()
              : ""
          );
          if (result) {
            setDataSearch(result);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm công việc:", error);
      }
    };

    fetchData();
  }, [router.query.search, router.query.location, router.query.industry]);

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
              isLoading={isLoading}
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
                        <JobCard
                          data={ele}
                          key={ele?._id || index}
                          listResumes={listResumes}
                        />
                      ))
                    : Array.isArray(dataSearch) &&
                      dataSearch?.map((ele: any, index: number) => (
                        <JobCard
                          data={ele}
                          key={ele?._id || index}
                          listResumes={listResumes}
                        />
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
