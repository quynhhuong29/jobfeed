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
  data: string[];
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
  const [listUser, setListUser] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const response = await getUserInfoById(id);
        setListUser((prevList) => {
          const updatedList = [...prevList, response?.user];
          const list = Array.from(
            new Set(updatedList.map((user) => user._id))
          ).map((_id) => {
            return updatedList.find((user) => user._id === _id);
          });
          return list;
        });
      } catch (err) {}
    };

    if (!data && !title) return;
    data?.forEach((item: string) => {
      fetchData(item);
    });
  }, [data, title]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setListUser([]);
      }}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {listUser?.map((item: User) => (
            <UserCard user={item} key={item._id} userAuth={userAuth} />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalFollower;
