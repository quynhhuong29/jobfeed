import { User } from "@/types/User";
import { Avatar, Button, useDisclosure, WrapItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalCreatePost from "./ModalCreatePost";
import SideBar from "./SideBar";
import Suggestions from "./Suggestions";

const NewsFeed = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [userAuth, setUserAuth] = useState<User>();

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  return (
    <div className="grid grid-cols-7 gap-5">
      <div className="col-span-2 p-3">
        <SideBar user={userAuth!} />
      </div>
      <div className="col-span-3">
        <div className="flex gap-2 mb-4 p-5 rounded-lg bg-white w-full border border-[rgba(0, 0, 0, 0.125)]">
          <WrapItem>
            <Avatar size="md" name="Avatar" src="" />
          </WrapItem>
          <Button
            size="lg"
            sx={{
              width: "100%",
              background: "#f1f1f1",
              borderRadius: "30px",
              color: "#555",
              padding: "0 16px",
              margin: "0 5px",
              textAlign: "left",
              fontWeight: "400",
              display: "block",
              fontSize: "14px",
            }}
            onClick={onOpen}
          >
            What&apos; your job?
          </Button>
          <ModalCreatePost isOpen={isOpen} onClose={onClose} />
        </div>
      </div>
      <div className="col-span-2 p-3">
        <Suggestions />
      </div>
    </div>
  );
};

export default NewsFeed;
