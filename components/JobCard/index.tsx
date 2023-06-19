/* eslint-disable @next/next/no-img-element */
import { submitCV } from "@/redux/apis/submitCvAPI";
import { formatMoney } from "@/utils/number.util";
import { filePdfUpload } from "@/utils/upload.util";
import { ArrowRightIcon } from "@chakra-ui/icons";
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
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomBadge from "../CustomBadge";
import { HeartIcon, MapPinIcon } from "../icons";
import styles from "./JobCard.module.scss";

export interface Props {
  data: any;
}
function JobCard({ data }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [resume, setResume] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResume = async () => {
    let file: any = "";
    if (!data._id && !data.company_info._id) return;

    setIsLoading(true);
    if (resume) {
      file = await filePdfUpload(resume);
    }

    try {
      await submitCV({
        idJob: data._id,
        idCompany: data.company_info._id,
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

  return (
    <div
      className={`w-full flex flex-col border-gray-300 bg-white rounded-lg min-h-[42px] ${styles.card_container}`}
    >
      <div className="flex flex-1 p-3 pt-4 items-start gap-3 relative">
        <div className="rounded-lg w-[16%]">
          <img
            src={data?.company_info?.logo}
            alt="logo"
            className="mx-auto w-14 h-14"
          />
        </div>
        <div>
          <div>
            <Link
              href={`/jobDetails/${data?._id}`}
              className="inline-block mr-2"
            >
              <h5 className="text-gray-800 font-semibold text-[17px]">
                {data?.job_title}
              </h5>
            </Link>
            {data?.working_experience?.isRequired && (
              <span className="text-sm text-gray-600">
                ({data?.working_experience?.from || 0}-
                {data?.working_experience?.to || 0} Yrs Exp.)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {data?.company_info?.companyName || ""}
          </p>
          <div className="flex items-center gap-1 my-1">
            <MapPinIcon height="20px" width="10px" fill="#74788d" />
            <p className="text-sm text-gray-600">
              {data?.working_location || ""}
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {formatMoney(Number(data?.salary?.min), data?.salary?.money_type)} -{" "}
            {formatMoney(Number(data?.salary?.max), data?.salary?.money_type)} /
            month
          </p>
          <div className="">
            {data?.keys?.map((key: string, index: number) => {
              if (key === "fulltime") {
                return (
                  <CustomBadge colorScheme="green" className="mt-1" key={index}>
                    Full Time
                  </CustomBadge>
                );
              }
              if (key === "private")
                return (
                  <CustomBadge colorScheme="cyan" className="mt-1" key={index}>
                    Private
                  </CustomBadge>
                );
              if (key === "partTime")
                return (
                  <CustomBadge colorScheme="pink" className="mt-1" key={index}>
                    Part Time
                  </CustomBadge>
                );
              if (key === "urgent")
                return (
                  <CustomBadge colorScheme="red" className="mt-1" key={index}>
                    Urgent
                  </CustomBadge>
                );
              if (key === "freelancer")
                return (
                  <CustomBadge
                    colorScheme="purple"
                    className="mt-1"
                    key={index}
                  >
                    Freelancer
                  </CustomBadge>
                );
            })}
          </div>
        </div>
        <IconButton
          aria-label="Search database"
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
            position: "absolute",
            top: "14px",
            right: "20px",
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
      <div className="flex p-4 mt-auto items-center justify-between bg-gray-200 text-[15px] text-gray-800 rounded-b-lg">
        {data.note && (
          <p>
            Note: <span className="text-gray-600">{data.note}</span>
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
      </div>
    </div>
  );
}

export default JobCard;
