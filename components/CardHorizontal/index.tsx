/* eslint-disable @next/next/no-img-element */
import { submitCV } from "@/redux/apis/submitCvAPI";
import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import { formatMoney } from "@/utils/number.util";
import { filePdfUpload } from "@/utils/upload.util";
import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomBadge from "../CustomBadge";
import { MapPinIcon, StarIcon } from "../icons";
import styles from "./CardHorizontal.module.scss";

export interface ICardHorizontal {
  data: any;
  listResumes?: any;
}
type FormData = {
  name: string;
  email: string;
};
const CardHorizontal = ({ data, listResumes }: ICardHorizontal) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [resume, setResume] = useState<any>();
  const [document, setDocument] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCV, setIsLoadingCV] = useState(false);
  const [valueResume, setValueResume] = useState("");

  const isAuthenticated = useSelector(selectIsLoggedIn);

  const { handleSubmit, register } = useForm<FormData>({
    mode: "onChange",
  });
  const handleSendResume = async (dataForm: FormData) => {
    let file: any = "";
    let documentFile: any = "";
    if (!data._id && !data.company_info._id) return;

    if (!resume) {
      toast.error("Please select resume!");
      return;
    }

    setIsLoading(true);
    if (resume) {
      file = await filePdfUpload(resume);
    }

    if (document) {
      documentFile = await filePdfUpload(document);
    }

    try {
      await submitCV({
        idJob: data._id,
        idCompany: data.company_info._id,
        resumeFile: file,
        dateSubmit: new Date().toISOString(),
        name: dataForm.name || "",
        email: dataForm.email || "",
        documentFile: documentFile,
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

  const handleSendCV = async () => {
    if (!valueResume && !data._id && !data.company_info._id) return;
    setIsLoadingCV(true);

    const resume = listResumes.find((item: any) => item._id === valueResume);

    if (!resume) {
      toast.error("Please select resume!");
      return;
    }

    let documentFile: any = "";
    if (document) {
      documentFile = await filePdfUpload(document);
    }
    try {
      await submitCV({
        idJob: data._id,
        idCompany: data.company_info._id,
        dataCV: resume,
        dateSubmit: new Date().toISOString(),
        idCV: valueResume,
        documentFile: documentFile,
      });

      toast.success("Submit CV successfully!");
      onClose();
      setIsLoadingCV(false);
    } catch (err: any) {
      setIsLoadingCV(false);
      if (err?.response?.data?.msg) {
        toast.error(err?.response?.data?.msg);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
  return (
    <div
      className={`w-full relative mt-6 border-gray-300 bg-white rounded-lg min-h-[42px] ${styles.card_container}`}
    >
      <div className="absolute z-[2] translate-x-[10px] translate-y-2 rotate-[36deg]">
        <StarIcon width={"22px"} height={"22px"} fill="#fff" />
      </div>
      <div className="flex p-6 items-center justify-evenly">
        <div className="rounded-lg w-[16%]">
          <img
            src={data?.company_info?.logo}
            alt="logo"
            className="mx-auto rounded-lg w-[55px] h-[55px]"
          />
        </div>
        <div className="flex flex-col w-[25%]">
          <h5 className="text-gray-800">{data?.job_title}</h5>
          <p className="text-sm text-gray-600">
            {data?.company_info?.companyName}
          </p>
        </div>
        <div className="flex items-center gap-1 w-[16%]">
          <MapPinIcon height="22px" width="16px" />
          <p className="text-[16px] text-gray-600">{data?.working_location}</p>
        </div>
        <p className="text-[16px] text-gray-600 w-[24%]">
          <span className="text-green-200 block">Salary</span>
          {formatMoney(Number(data?.salary?.min), data?.salary?.money_type)}-
          {formatMoney(Number(data?.salary?.max), data?.salary?.money_type)}/m{" "}
        </p>
        <div className="w-[16%]">
          {data?.employment_type === "Full-time" && (
            <CustomBadge colorScheme="green" className="mt-1">
              Full-time
            </CustomBadge>
          )}
          {data?.employment_type === "Part-time" && (
            <CustomBadge colorScheme="pink" className="mt-1">
              Part-time
            </CustomBadge>
          )}
          {data?.employment_type === "Freelance" && (
            <CustomBadge colorScheme="purple" className="mt-1">
              Freelancer
            </CustomBadge>
          )}
          {data?.employment_type === "Temporary/Contract" && (
            <CustomBadge colorScheme="orange" className="mt-1">
              Temporary/Contract
            </CustomBadge>
          )}
          {data?.employment_type === "Remote/Work from home" && (
            <CustomBadge colorScheme="cyan" className="mt-1">
              Remote
            </CustomBadge>
          )}
          {data?.employment_type === "Fixed-term" && (
            <CustomBadge colorScheme="teal" className="mt-1">
              Fixed-term
            </CustomBadge>
          )}
          {data?.employment_type === "Internship" && (
            <CustomBadge colorScheme="purple" className="mt-1">
              Internship
            </CustomBadge>
          )}
          {data?.employment_type === "Self-employed" && (
            <CustomBadge colorScheme="yellow" className="mt-1">
              Self-employed
            </CustomBadge>
          )}
          {data?.employment_type === "Casual" && (
            <CustomBadge colorScheme="gray" className="mt-1">
              Casual
            </CustomBadge>
          )}
          {data?.employment_type === "Direct hire" && (
            <CustomBadge colorScheme="facebook" className="mt-1">
              Direct hire
            </CustomBadge>
          )}
        </div>
      </div>
      <div className="flex p-4 items-center justify-between bg-gray-200 text-[15px] text-gray-800 rounded-b-lg">
        {data?.working_experience?.isRequired && (
          <p>
            Experience:{" "}
            <span className="text-gray-600">
              {data?.working_experience?.from || 0}-
              {data?.working_experience?.to || 0}
            </span>
          </p>
        )}
        <Button
          rightIcon={<ArrowRightIcon w={2} h={2} />}
          variant="link"
          sx={{ fontSize: "15px", color: "#314047", marginLeft: "auto" }}
          size="xs"
          onClick={onOpen}
        >
          Apply Now
        </Button>
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
              {isAuthenticated ? (
                <Tabs variant="enclosed">
                  <TabList>
                    <Tab>Upload Resume</Tab>
                    <Tab>Your list resumes</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div className=" mb-3">
                        <label className="text-gray-700">Name</label>
                        <Input
                          type="text"
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
                          {...register("name")}
                        />
                      </div>
                      <div className=" mb-3">
                        <label className="text-gray-700">Email</label>
                        <Input
                          type="email"
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
                          {...register("email")}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="text-base mb-2 inline-block">
                          Resume Upload
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(event: any) =>
                            setResume(event.target.files)
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <label className="text-base mb-2 inline-block">
                          Document
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(event: any) =>
                            setDocument(event.target.files)
                          }
                        />
                      </div>
                      <Button
                        colorScheme="green"
                        onClick={handleSubmit(handleSendResume)}
                        isLoading={isLoading}
                        float="right"
                      >
                        Send Application
                      </Button>
                    </TabPanel>
                    <TabPanel>
                      <p className="text-gray-600 text-base">
                        You have {listResumes?.length || 0} resume on Job
                        Library. Please select a resume to apply for
                      </p>
                      <RadioGroup
                        onChange={setValueResume}
                        value={valueResume}
                        mt={3}
                      >
                        <Stack spacing={5} direction="column">
                          {listResumes?.map((ele: any) => {
                            return (
                              <Radio
                                colorScheme="green"
                                key={ele._id}
                                value={ele._id}
                                size="lg"
                              >
                                {ele.title}
                              </Radio>
                            );
                          })}
                        </Stack>
                      </RadioGroup>
                      <div className="mb-5">
                        <label className="text-base mb-2 inline-block">
                          Document
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(event: any) =>
                            setDocument(event.target.files)
                          }
                        />
                      </div>
                      <Button
                        colorScheme="green"
                        onClick={handleSendCV}
                        isLoading={isLoadingCV}
                        float="right"
                      >
                        Send Application
                      </Button>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : (
                <div className="flex">
                  Please&nbsp;
                  <Link href="/login" className="text-blue hover:underline">
                    Login
                  </Link>
                  &nbsp;or&nbsp;
                  <Link href="/signup" className="text-blue hover:underline">
                    Register
                  </Link>
                  &nbsp;to apply for this job
                </div>
              )}
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default CardHorizontal;
