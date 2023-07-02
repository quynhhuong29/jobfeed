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
import { jobCard, jobListData } from "@/data/homePageData";
import withAuth from "@/hocs/withAuth";
import { useDataFetching } from "@/hooks/dataFetchingHook";
import { selectAuth } from "@/redux/reducers/authReducers";
import { ChevronRightIcon, EditIcon } from "@chakra-ui/icons";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Select,
  Textarea,
  WrapItem,
} from "@chakra-ui/react";
import ErrorMessage from "@/components/ErrorMessage";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyInput from "react-currency-input-field";
import { useAppDispatch } from "@/redux/store";
import {
  getAllIndustryAsync,
  selectIndustry,
} from "@/redux/reducers/industryReducers";
import { Industry } from "@/types/Industry";
import { toast } from "react-toastify";
import { createJobAsync, selectJob } from "@/redux/reducers/jobReducers";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import { User } from "@/types/User";
import {
  CAREER_LEVEL,
  CURRENCY_OPTION,
  EMPLOYMENT_TYPE,
  PROVINCE_CITY,
} from "@/constants/jobPost";

type FormData = {
  jobTitle: string;
  jobRequirement: string;
  jobDescription: string;
  industry: string;
  workingLocation: string;
  benefit: string;
  contactName: string;
  contactPhone: string;
  contactAddress: string;
  contactEmail: string;
  expiringDate: string;
  address: string;
  minSalary: number;
  maxSalary: number;
  experienceFrom: number;
  experienceTo: number;
  employmentType: string;
  careerLevel: string;
};

const jobPost = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userAuth, setUserAuth] = useState<User>();
  const [isExperience, setIsExperience] = useState(true);
  const [salary, setSalary] = useState({
    minSalary: 0,
    maxSalary: 0,
  });
  const [intlConfig, setIntlConfig] = useState<{
    locale: string;
    currency: string;
  }>(CURRENCY_OPTION[0]);

  const auth = useSelector(selectAuth);
  const industry = useSelector(selectIndustry);
  const company = useSelector(selectCompany);
  const job = useSelector(selectJob);

  const { handleSubmit, register, setValue, reset } = useForm<FormData>({
    mode: "onChange",
  });

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  const handleChangeCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const config = CURRENCY_OPTION.find(
      (ele) => ele.locale === event.target.value
    );
    if (config) {
      setIntlConfig(config);
    }
  };

  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "Experience") setIsExperience(true);
    else setIsExperience(false);
  };

  const handleSalaryChange = (value: any, name: any) => {
    if (value && name) {
      setSalary((prevSalary) => ({
        ...prevSalary,
        [name]: parseInt(value),
      }));
    }
  };

  const handleCreateJob = async (data: any) => {
    const request = {
      job_title: data.jobTitle,
      job_description: data.jobDescription,
      job_requirement: data.jobRequirement,
      industry: data.industry,
      working_location: data.workingLocation,
      address: data.address,
      employment_type: data.employmentType,
      expiring_date: data.expiringDate,
      benefit: data.benefit,
      experience: {
        isRequired: isExperience,
        from: isExperience ? data.experienceFrom : 0,
        to: isExperience ? data.experienceTo : 0,
      },
      level: data.careerLevel,
      salary: {
        money_type: intlConfig.currency,
        min: salary.minSalary.toString(),
        max: salary.maxSalary.toString(),
      },
      contact_name: data.contactName,
      contact_address: data.contactAddress,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      company_id: company?.infoCompany?._id,
      idUser: userAuth?._id, //companyId
    };

    try {
      await dispatch(createJobAsync(request));
      toast.success("Create a job success!!!");
      reset((formValues) => ({
        ...formValues,
        jobTitle: "",
        jobRequirement: "",
        jobDescription: "",
        industry: "",
        workingLocation: "",
        benefit: "",
        contactName: "",
        contactPhone: "",
        contactAddress: "",
        contactEmail: "",
        expiringDate: "",
        address: "",
        minSalary: 0,
        maxSalary: 1,
        experienceFrom: 0,
        experienceTo: 1,
        employmentType: "",
        careerLevel: "",
      }));
    } catch (err: any) {
      if (err.message) toast.error(err.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (auth && auth?.role !== "company") {
      router.push("/");
      return;
    }
  }, [auth, router]);

  useEffect(() => {
    dispatch(getAllIndustryAsync());
    if (userAuth?._id) dispatch(getInfoCompanyAsync(userAuth._id));
  }, [userAuth?._id, dispatch]);

  useEffect(() => {
    if (company?.infoCompany) {
      setValue("contactName", company?.infoCompany?.companyName);
      setValue("contactAddress", company?.infoCompany?.address);
      setValue("contactPhone", company?.infoCompany?.phone);
    }
    if (userAuth?.email) setValue("contactEmail", userAuth?.email);
  }, [company?.infoCompany, setValue, userAuth?.email]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Create a job</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <form
            className="border border-gray-300 rounded-lg shadow-lg p-6"
            onSubmit={handleSubmit(handleCreateJob)}
          >
            <div className="mt-4">
              <h5 className="text-lg text-gray-700 mb-2 font-bold">
                Requirement Information
              </h5>
              <div className="grid grid-flow-row gap-4">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="text-base mb-2 inline-block"
                  >
                    Job title
                  </label>
                  <Input
                    type="text"
                    id="jobTitle"
                    placeholder="Enter your job title"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("jobTitle")}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="jobDescription"
                    className="text-base mb-2 inline-block"
                  >
                    Job description
                  </label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Say something..."
                    autoComplete="off"
                    sx={{
                      minHeight: "125px",
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("jobDescription")}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="jobRequirement"
                    className="text-base mb-2 inline-block"
                  >
                    Job requirement
                  </label>
                  <Textarea
                    id="jobRequirement"
                    placeholder="Say something..."
                    autoComplete="off"
                    sx={{
                      minHeight: "125px",
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("jobRequirement")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="industry"
                    className="text-base mb-2 inline-block"
                  >
                    Industry
                  </label>

                  <Select
                    placeholder="Select industry"
                    {...register("industry")}
                  >
                    {industry?.data?.map((ele: Industry) => (
                      <option key={ele._id} value={ele._id}>
                        {ele.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <label
                      htmlFor="workingLocation"
                      className="text-base mb-2 inline-block"
                    >
                      Working location
                    </label>

                    <Select
                      placeholder="Select working location"
                      defaultValue={PROVINCE_CITY[0]}
                      {...register("workingLocation")}
                    >
                      {PROVINCE_CITY.map((ele) => (
                        <option value={ele} key={ele}>
                          {ele}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="text-base mb-2 inline-block">
                      Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your address"
                      autoComplete="off"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #dbdfe2",
                        color: "#495057",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "500",
                        "&:focus-visible": {
                          outline: "0",
                          border: "1px solid #dbdfe2",
                          boxShadow: "none",
                        },
                      }}
                      {...register("address")}
                    />
                  </div>
                  <div>
                    <label className="text-base mb-2 inline-block">
                      Salary
                    </label>
                    <div className="flex gap-10">
                      <Select
                        defaultValue={CURRENCY_OPTION?.[0]?.locale}
                        onChange={handleChangeCurrency}
                      >
                        {CURRENCY_OPTION.map((ele: any, index: number) => (
                          <option value={ele.locale} key={index}>
                            {ele.currency}
                          </option>
                        ))}
                      </Select>
                      <CurrencyInput
                        id="minSalary"
                        name="minSalary"
                        placeholder="Please enter a min salary"
                        intlConfig={intlConfig}
                        defaultValue={1000}
                        decimalsLimit={2}
                        value={salary?.minSalary}
                        onValueChange={(value, name) =>
                          handleSalaryChange(value, name)
                        }
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "8px",
                          maxWidth: "160px",
                        }}
                      />

                      <CurrencyInput
                        id="maxSalary"
                        placeholder="Please enter a max salary"
                        name="maxSalary"
                        value={salary?.maxSalary}
                        intlConfig={intlConfig}
                        defaultValue={2000}
                        decimalsLimit={2}
                        onValueChange={(value, name) =>
                          handleSalaryChange(value, name)
                        }
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "8px",
                          maxWidth: "160px",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-base mb-2 inline-block">
                      Expiring date
                    </label>
                    <Input
                      placeholder="Select Date and Time"
                      type="datetime-local"
                      id="expiringDate"
                      autoComplete="off"
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #dbdfe2",
                        color: "#495057",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "500",
                        "&:focus-visible": {
                          outline: "0",
                          border: "1px solid #dbdfe2",
                          boxShadow: "none",
                        },
                      }}
                      {...register("expiringDate")}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="employmentType"
                      className="text-base mb-2 inline-block"
                    >
                      Employment type
                    </label>

                    <Select
                      placeholder="Select employment type"
                      defaultValue={EMPLOYMENT_TYPE[0]}
                      {...register("employmentType")}
                    >
                      {EMPLOYMENT_TYPE.map((ele) => (
                        <option value={ele} key={ele}>
                          {ele}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="careerLevel"
                      className="text-base mb-2 inline-block"
                    >
                      Career level
                    </label>

                    <Select
                      placeholder="Select career level"
                      defaultValue={CAREER_LEVEL[0]}
                      {...register("careerLevel")}
                    >
                      {CAREER_LEVEL.map((ele) => (
                        <option value={ele} key={ele}>
                          {ele}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="benefit"
                    className="text-base mb-2 inline-block"
                  >
                    Benefit
                  </label>
                  <Textarea
                    id="benefit"
                    placeholder="Say something..."
                    autoComplete="off"
                    sx={{
                      minHeight: "125px",
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("benefit")}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-base mb-2 inline-block">
                    Experience
                  </label>
                  <div className="flex items-center gap-5">
                    <div className="max-w-[200px]">
                      <Select onChange={handleExperienceChange}>
                        <option value={"Experience"}>Experience</option>
                        <option value={"No Experience"}>No Experience</option>
                      </Select>
                    </div>
                    {isExperience && (
                      <Input
                        type="number"
                        placeholder="From"
                        autoComplete="off"
                        min={0}
                        max={100}
                        sx={{
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          "&:focus-visible": {
                            outline: "0",
                            border: "1px solid #dbdfe2",
                            boxShadow: "none",
                          },
                          maxWidth: "160px",
                        }}
                        {...register("experienceFrom")}
                      />
                    )}
                    {isExperience && (
                      <Input
                        type="number"
                        placeholder="To"
                        autoComplete="off"
                        min={0}
                        max={100}
                        sx={{
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          "&:focus-visible": {
                            outline: "0",
                            border: "1px solid #dbdfe2",
                            boxShadow: "none",
                          },
                          maxWidth: "160px",
                        }}
                        {...register("experienceTo")}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="text-lg text-gray-700 mb-2 font-bold">
                Contact Information
              </h5>
              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                <div>
                  <label className="text-base mb-2 inline-block">
                    Contact Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your contact name"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("contactName")}
                  />
                </div>
                <div>
                  <label className="text-base mb-2 inline-block">
                    Contact Phone
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your contact name"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("contactPhone")}
                  />
                </div>
                <div>
                  <label className="text-base mb-2 inline-block">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your contact name"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("contactEmail")}
                  />
                </div>
                <div>
                  <label className="text-base mb-2 inline-block">
                    Contact Address
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your contact name"
                    autoComplete="off"
                    sx={{
                      backgroundColor: "#fff",
                      border: "1px solid #dbdfe2",
                      color: "#495057",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "500",
                      "&:focus-visible": {
                        outline: "0",
                        border: "1px solid #dbdfe2",
                        boxShadow: "none",
                      },
                    }}
                    {...register("contactAddress")}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                colorScheme={"green"}
                isLoading={job?.isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </section>
    </LayoutMain>
  );
};

export default withAuth(jobPost);
