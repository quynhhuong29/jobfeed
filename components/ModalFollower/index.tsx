/* eslint-disable @next/next/no-img-element */
import { User } from "@/types/User";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import UserCard from "../UserCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: User[];
  userAuth?: User;
  type?: "followers" | "following";
}

const ModalFollower = ({
  isOpen,
  onClose,
  title,
  data,
  userAuth,
  type,
}: Props) => {
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {data?.map((item: User) => (
            <UserCard user={item} key={item._id} userAuth={userAuth} />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalFollower;
