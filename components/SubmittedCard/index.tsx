import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
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
import dateFormat from "dateformat";
import { useState } from "react";
import { toast } from "react-toastify";
import { unSubmitted } from "@/redux/apis/submitCvAPI";
import { useAppDispatch } from "@/redux/store";
import { updateSubmittedAction } from "@/redux/reducers/submitReducers";
import { removeNotifyAsync } from "@/redux/reducers/notifyReducers";
import { useSelector } from "react-redux";
import { selectSocket } from "@/redux/reducers/socketReducers";

interface Props {
  data: any;
}

const SubmittedCard = ({ data }: Props) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const socket = useSelector(selectSocket);
  const handleDeleteSubmitted = async () => {
    setIsLoading(true);

    try {
      await unSubmitted(data?.jobInfo?._id);
      dispatch(updateSubmittedAction(data?.jobInfo?._id));

      const msg = {
        id: data?.jobInfo?._id,
        text: "submitted resume.",
        content: data?.jobInfo?.job_title,
        recipients: data?.jobInfo?.company_info?.idCompany,
        url: `/manageJob/listCV/${data?.jobInfo?._id}`,
      };
      dispatch(removeNotifyAsync({ msg, socket }));
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-400 pb-4 mb-6 gap-6">
      <div className="flex-1">
        <Link href={`/jobDetails/${data?.jobInfo?._id}`}>
          <p className="text-lg text-gray-800 font-semibold hover:underline inline-block mr-1 mb-[6px]">
            {data?.jobInfo?.job_title}
          </p>
        </Link>
        <Link href={`/companyDetails/${data?.jobInfo?.company_info?._id}`}>
          <p className="inline-block text-gray-800 font-medium hover:underline">
            ({data?.jobInfo?.company_info?.companyName})
          </p>
        </Link>
        <div className="flex items-center justify-between">
          <p className="font-semibold">
            Status:{" "}
            <span
              className={`${
                data?.cv[0]?.status === "Waiting"
                  ? "text-yellow-500"
                  : data?.cv[0]?.status === "Accept"
                  ? "text-green-500"
                  : "text-red-500"
              } font-medium`}
            >
              {data?.cv[0]?.status}
            </span>
          </p>
          <p className="font-semibold">
            Applied on:{" "}
            <span className="text-gray-800 font-medium">
              {dateFormat(new Date(data?.createdAt), "dd/mm/yyyy")}
            </span>
          </p>
          <p className="font-semibold text-red-500">
            Expired on:{" "}
            <span className="text-gray-800 font-medium">
              {dateFormat(new Date(data?.jobInfo?.expiring_date), "dd/mm/yyyy")}
            </span>
          </p>
        </div>
      </div>
      <div className="mx-8">
        <Button
          type="button"
          leftIcon={<DeleteIcon />}
          size="md"
          colorScheme={"green"}
          onClick={onOpen}
          isDisabled={data?.cv[0]?.status === "Accept"}
        >
          Delete
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>UnSubmit?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to unsubmit this job?</ModalBody>

          <ModalFooter sx={{ gap: "4px" }}>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleDeleteSubmitted}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SubmittedCard;
