import ViewCV from "@/pages/manageJob/viewCV";
import {
  deleteResumeAction,
  deleteResumeAsync,
} from "@/redux/reducers/resumeReducers";
import { useAppDispatch } from "@/redux/store";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
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
import dateFormat from "dateformat";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  data: any;
  index: number;
}

const ResumeCard = ({ data, index }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleDeleteResume = async () => {
    if (!data._id) return;

    setIsLoading(true);
    try {
      dispatch(deleteResumeAsync(data._id));
      dispatch(deleteResumeAction(data._id));
      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  };
  return (
    <div className="border-b border-gray-400 pb-4 mb-6">
      <p className="text-base text-gray-800 mb-2 font-semibold">
        Resume {index}: {data?.title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">ID: </span>
          JVR{data?._id}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Date create: </span>
          {dateFormat(new Date(data?.createdAt), "dd/MM/yyyy")}
        </p>
      </div>
      <div className="flex items-center mx-auto gap-3 mt-3">
        <Button
          type="button"
          leftIcon={<ViewIcon />}
          size="md"
          colorScheme={"green"}
          onClick={() => {
            window.open(
              `/viewCV?state=${encodeURIComponent(JSON.stringify(data))}`,
              "_blank"
            );
          }}
        >
          View
        </Button>
        <Button
          type="button"
          leftIcon={<EditIcon />}
          size="md"
          colorScheme={"green"}
          onClick={() => {
            router.push(
              `/manageCV/updateCV?state=${encodeURIComponent(
                JSON.stringify(data)
              )}`
            );
          }}
        >
          Update
        </Button>
        <Button
          type="button"
          leftIcon={<DeleteIcon />}
          size="md"
          colorScheme={"green"}
          onClick={onOpen}
        >
          Delete
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete CV?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this CV?</ModalBody>

          <ModalFooter sx={{ gap: "4px" }}>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleDeleteResume}
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

export default ResumeCard;
