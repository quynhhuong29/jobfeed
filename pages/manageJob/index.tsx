/* eslint-disable react-hooks/rules-of-hooks */
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import {
  getJobsByCompanyAsync,
  selectJob,
  updateJobAsync,
} from "@/redux/reducers/jobReducers";
import { useAppDispatch } from "@/redux/store";
import { User } from "@/types/User";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Tab,
  Table,
  TableCaption,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dateFormat from "dateformat";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { deleteJob } from "@/redux/apis/jobApi";
import {
  CAREER_LEVEL,
  CURRENCY_OPTION,
  EMPLOYMENT_TYPE,
  PROVINCE_CITY,
} from "@/constants/jobPost";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import {
  getAllIndustryAsync,
  selectIndustry,
} from "@/redux/reducers/industryReducers";
import { Industry } from "@/types/Industry";
import { toast } from "react-toastify";

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

const manageJob = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
    onOpen: onOpenEdit,
  } = useDisclosure();

  const auth = useSelector(selectAuth);
  const job = useSelector(selectJob);
  const company = useSelector(selectCompany);
  const industry = useSelector(selectIndustry);

  const [userAuth, setUserAuth] = useState<User>();
  const [idDelete, setIdDelete] = useState<string>("");
  const [idEdit, setIdEdit] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [isExperience, setIsExperience] = useState(true);
  const [salary, setSalary] = useState({
    minSalary: 0,
    maxSalary: 0,
  });
  const [intlConfig, setIntlConfig] = useState<{
    locale: string;
    currency: string;
  }>(CURRENCY_OPTION[0]);

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

  useEffect(() => {
    if (auth && auth?.role !== "company") {
      router.push("/");
      return;
    }
  }, [auth, router]);

  useEffect(() => {
    if (userAuth?._id) dispatch(getInfoCompanyAsync(userAuth._id));
  }, [userAuth?._id, dispatch]);

  useEffect(() => {
    if (company.infoCompany?.idCompany)
      dispatch(getJobsByCompanyAsync(company.infoCompany.idCompany));
  }, [company.infoCompany.idCompany, dispatch]);

  useEffect(() => {
    if (industry?.data?.length <= 0) {
      dispatch(getAllIndustryAsync());
    }
  }, [industry?.data, dispatch]);

  useEffect(() => {
    if (idEdit && job?.listJobCompany) {
      const jobEdit = job?.listJobCompany.find(
        (ele: any) => ele._id === idEdit
      );

      if (jobEdit) {
        setValue("jobTitle", jobEdit.job_title);
        setValue("jobDescription", jobEdit.job_description);
        setValue("jobRequirement", jobEdit.job_requirement);
        setValue("industry", jobEdit.industry?._id);
        setValue("workingLocation", jobEdit.working_location);
        setValue("address", jobEdit.address);
        setValue("employmentType", jobEdit.employment_type);
        setValue("benefit", jobEdit.benefit);
        setValue("expiringDate", jobEdit.expiring_date);
        setValue("careerLevel", jobEdit.level);
        setValue("contactName", jobEdit.contact_name);
        setValue("contactPhone", jobEdit.contact_phone);
        setValue("contactAddress", jobEdit.contact_address);
        setValue("contactEmail", jobEdit.contact_email);

        setSalary({
          minSalary: jobEdit.salary?.min,
          maxSalary: jobEdit.salary?.max,
        });

        if (jobEdit.working_experience?.isRequired) {
          setIsExperience(true);
          setValue("experienceFrom", jobEdit.working_experience?.from);
          setValue("experienceTo", jobEdit.working_experience?.to);
        }
        const intl = CURRENCY_OPTION?.find(
          (ele) => ele.currency === jobEdit?.salary?.money_type
        );
        if (intl) {
          setIntlConfig(intl);
        }
      }
    }
  }, [idEdit, job?.listJobCompany, setValue]);

  const handleDeleteJob = async (id: string) => {
    setLoadingDelete(true);
    try {
      await deleteJob(id);

      onClose();
      dispatch(getJobsByCompanyAsync(company.infoCompany.idCompany));
      setLoadingDelete(false);
      setIdDelete("");
    } catch (err) {
      setLoadingDelete(true);
      console.log(err);
    }
  };

  const handleUpdateJob = async (data: any) => {
    if (!idEdit) return;

    setLoadingEdit(true);
    const request = {
      id: idEdit,
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
    };

    try {
      const res: any = await dispatch(updateJobAsync(request));

      if (res?.error) {
        toast.error(res?.payload?.msg);
        setLoadingEdit(false);
      } else {
        toast.success("Update a job success!!!");
        onCloseEdit();
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
        await dispatch(getJobsByCompanyAsync(company.infoCompany.idCompany));
      }
    } catch (err: any) {
      setLoadingEdit(false);
      if (err.msg) toast.error(err.msg);
      else toast.error("Something went wrong. Please try again.");
    }
  };

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

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Manage Job</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-10">
        <div className="md:max-w-[1164px] mx-auto shadow-md p-6">
          <div className="flex items-center justify-end">
            <Button
              colorScheme={"green"}
              mt={4}
              float={"right"}
              onClick={() => {
                router.push("/jobPost");
              }}
            >
              Create a job
            </Button>
          </div>
          <div className="mt-4">
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Job available</Tab>
                <Tab>Expired Job</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Job title</Th>
                          <Th>Industry</Th>
                          <Th>Level</Th>
                          <Th>Create date</Th>
                          <Th>Expiring date</Th>
                          <Th sx={{ textAlign: "center" }}>Action</Th>
                        </Tr>
                      </Thead>
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
                        <Tbody>
                          {job?.listJobCompany
                            ?.filter((ele: any) => {
                              const date = new Date();
                              const eleDate = new Date(ele?.expiring_date);
                              return eleDate > date;
                            })
                            ?.map((item: any) => (
                              <Tr key={item._id}>
                                <Td>{item?.job_title}</Td>
                                <Td>{item?.industry?.title}</Td>
                                <Td>{item?.level}</Td>
                                <Td>
                                  {dateFormat(item?.updatedAt, "dd/mm/yyyy")}
                                </Td>
                                <Td>
                                  {dateFormat(
                                    item?.expiring_date,
                                    "dd/mm/yyyy"
                                  )}
                                </Td>
                                <Td>
                                  <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdEdit(item._id);
                                      onOpenEdit();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="View job"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      router.push(
                                        `/manageJob/listCV/${item._id}`
                                      );
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))}
                        </Tbody>
                      )}
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Job title</Th>
                          <Th>Industry</Th>
                          <Th>Level</Th>
                          <Th>Create date</Th>
                          <Th>Expiring date</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
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
                        <Tbody>
                          {job?.listJobCompany
                            ?.filter((ele: any) => {
                              const date = new Date();
                              const eleDate = new Date(ele?.expiring_date);
                              return eleDate < date;
                            })
                            ?.map((item: any) => (
                              <Tr key={item._id}>
                                <Td>{item?.job_title}</Td>
                                <Td>{item?.industry?.title}</Td>
                                <Td>{item?.level}</Td>
                                <Td>
                                  {dateFormat(item?.updatedAt, "dd/mm/yyyy")}
                                </Td>
                                <Td>
                                  {dateFormat(
                                    item?.expiring_date,
                                    "dd/mm/yyyy"
                                  )}
                                </Td>
                                <Td>
                                  <IconButton
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdEdit(item._id);
                                      onOpenEdit();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                  <IconButton
                                    aria-label="View job"
                                    icon={<ViewIcon />}
                                    variant="ghost"
                                    onClick={() => {
                                      setIdDelete(item._id);
                                      onOpen();
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))}
                        </Tbody>
                      )}
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete Job?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>Are you sure you want to delete this job?</ModalBody>

                <ModalFooter sx={{ gap: "4px" }}>
                  <Button variant="ghost" onClick={onClose}>
                    No
                  </Button>
                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={() => handleDeleteJob(idDelete)}
                    isLoading={loadingDelete}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Drawer
              isOpen={isOpenEdit}
              placement="right"
              onClose={onCloseEdit}
              size="lg"
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">Update Job</DrawerHeader>

                <DrawerBody>
                  <form
                    // className="border border-gray-300 rounded-lg shadow-lg p-6"
                    onSubmit={handleSubmit(handleUpdateJob)}
                  >
                    <div className="mt-4">
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
                              // defaultValue={CAREER_LEVEL[0]}
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
                        <div>
                          <label className="text-base mb-2 inline-block">
                            Salary
                          </label>
                          <div className="flex gap-10">
                            <Select
                              defaultValue={CURRENCY_OPTION?.[0]?.locale}
                              value={
                                intlConfig?.locale ||
                                CURRENCY_OPTION?.[0]?.locale
                              }
                              onChange={handleChangeCurrency}
                            >
                              {CURRENCY_OPTION.map(
                                (ele: any, index: number) => (
                                  <option value={ele.locale} key={index}>
                                    {ele.currency}
                                  </option>
                                )
                              )}
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
                                <option value={"No Experience"}>
                                  No Experience
                                </option>
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
                  </form>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={onCloseEdit}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="green"
                    onClick={handleSubmit(handleUpdateJob)}
                    isLoading={loadingEdit}
                  >
                    Update
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
};

export default withAuth(manageJob);
