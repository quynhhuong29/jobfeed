import React from "react";
import LeftSide from "../../components/Message/LeftSide";
import { LayoutMain } from "@/components/layout";
import { MessengerIcon } from "@/components/icons";

const Message = () => {
  return (
    <LayoutMain>
      <div className="message flex my-5">
        <div className="border-right px-0 h-full">
          <LeftSide />
        </div>

        <div className="w-full px-0 right_mess">
          <div
            className="flex justify-center 
                items-center flex-col h-full"
          >
            <MessengerIcon width="80px" height="80px" />
            <h4>Messenger</h4>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};

export default Message;
