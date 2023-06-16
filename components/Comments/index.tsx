import { Comment } from "@/types/Comment";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import { useState } from "react";
import CommentCard from "./CommentCard";

interface Props {
  post: PostData;
  userAuth: User;
}
const Comments = ({ post, userAuth }: Props) => {
  const [amountComments, setAmountComments] = useState(2);

  const handleShowMore = () => {
    if (amountComments < post.comments.length)
      setAmountComments(amountComments + 2);
  };
  const handleShowLess = () => {
    setAmountComments(2);
  };
  return (
    <div className="flex flex-col">
      {post?.comments?.slice(-amountComments)?.map((comment: Comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          userAuth={userAuth}
          userPost={post.user}
          post={post}
          commentId={comment._id}
        />
      ))}
      {post.comments.length - amountComments > 0 ? (
        <div
          className="font-medium hover:underline cursor-pointer px-6 my-2 text-sm text-gray-700 ml-auto"
          onClick={handleShowMore}
        >
          Show More
        </div>
      ) : (
        post?.comments?.length > 2 && (
          <div
            className="font-medium hover:underline cursor-pointer px-6 text-sm text-gray-700 ml-auto"
            onClick={handleShowLess}
          >
            Show Less
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
