import { Comment } from "@/types/Comment";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { HeartIcon } from "../icons";

interface Props {
  comment: Comment;
}
const MAX_CONTENT_LENGTH = 150;

const CommentCard = ({ comment }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex gap-2 px-6 py-3">
      <Avatar size="sm" name="Avatar" src={comment?.user?.avatar || ""} />
      <div className="flex flex-col gap-1 w-full">
        <div className="rounded-lg p-2 bg-[#E4E6EB] text-sm text-gray-800 w-fit">
          <p className="text-xs font-semibold mb-1">{`${comment?.user?.firstName} ${comment?.user?.lastName}`}</p>
          {expanded || comment?.content?.length <= MAX_CONTENT_LENGTH
            ? comment?.content
            : comment?.content?.slice(0, MAX_CONTENT_LENGTH) + "..."}
          {comment?.content?.length > MAX_CONTENT_LENGTH && (
            <button
              className="text-gray-800 font-medium hover:underline ml-1"
              onClick={handleToggleExpand}
            >
              {expanded ? "Hide" : "Read More"}
            </button>
          )}
        </div>
        <div className="flex text-xs items-center justify-between text-gray-600 ml-1">
          <div className="flex gap-2">
            <div className="font-medium hover:underline cursor-pointer">
              Like
            </div>
            <div className="font-medium hover:underline cursor-pointer">
              Reply
            </div>
            <span>{moment(comment?.createdAt).fromNow()}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            0
            <HeartIcon
              width="18px"
              height="18px"
              sx={{
                fill: "#dc3545",
                "& path": {
                  stroke: "#dc3545",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
