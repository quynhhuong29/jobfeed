/* eslint-disable @next/next/no-img-element */
import { User } from "@/types/User";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FollowButton from "../FollowButton";
import UserCard from "../UserCard";
import { getUserInfoById } from "@/redux/apis/userAPI";
import { cloneDeep } from "lodash";

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
