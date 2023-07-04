import React from "react";
import LeftSide from "../../components/Message/LeftSide";
import RightSide from "../../components/Message/RightSide";
import { LayoutMain } from "@/components/layout";

const Conversation = () => {
  return (
    <LayoutMain>
      <div className="message flex my-5">
        <div className="border-r left_mess">
          <LeftSide />
        </div>

        <div className="flex-1 rounded-tr-lg">
          <RightSide />
        </div>
      </div>
    </LayoutMain>
  );
};

export default Conversation;
