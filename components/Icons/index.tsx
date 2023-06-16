import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface Props {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  content: string;
}
const Icons = ({ setContent, content }: Props) => {
  const [open, setOpen] = useState(false);
  const reactions = [
    "❤️",
    "😆",
    "😯",
    "😢",
    "😡",
    "👍",
    "👎",
    "😄",
    "😂",
    "😍",
    "😘",
    "😗",
    "😚",
    "😳",
    "😭",
    "😓",
    "😤",
    "🤤",
    "👻",
    "💀",
    "🤐",
    "😴",
    "😷",
    "😵",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Button sx={{ opacity: 0.4 }} variant="unstyled">
          😄
        </Button>
      </PopoverTrigger>
      <PopoverContent sx={{ maxWidth: "250px", p: "10px" }}>
        <div className="grid grid-cols-6 gap-1">
          {reactions.map((icon) => (
            <span
              key={icon}
              onClick={() => setContent(content + icon)}
              className="cursor-pointer hover:bg-gray-300 p-2 rounded-lg"
            >
              {icon}
            </span>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Icons;
