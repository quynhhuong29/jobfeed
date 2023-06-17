import { Comment } from "@/types/Comment";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";

interface Props {
  post: PostData;
  userAuth: User;
}
const Comments = ({ post, userAuth }: Props) => {
  const [amountComments, setAmountComments] = useState(2);
  const [amountCommentsReply, setAmountCommentsReply] = useState(2);
  const [replyComments, setReplyComments] = useState<Comment[]>([]);
  const handleShowMore = () => {
    if (amountComments < post.comments.length)
      setAmountComments(amountComments + 2);
  };
  const handleShowLess = () => {
    setAmountComments(2);
  };

  useEffect(() => {
    if (post?.comments) {
      let listReplyComments: Comment[] = [];
      post.comments.forEach((comment) => {
        if (comment.reply) {
          listReplyComments.push(comment);
        }
      });

      setReplyComments(listReplyComments);
    }
  }, [post?.comments]);

  return (
    <div className="flex flex-col">
      {post?.comments
        ?.filter((comment) => !comment.reply)
        ?.slice(-amountComments)
        ?.map((comment: Comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            userAuth={userAuth}
            userPost={post.user}
            post={post}
            commentId={comment._id}
            replyComments={replyComments}
            amountComments={amountCommentsReply}
            setAmountComments={setAmountCommentsReply}
          />
        ))}
      {post?.comments?.filter((comment) => !comment.reply)?.length -
        amountComments >
      0 ? (
        <div
          className="font-medium hover:underline cursor-pointer px-6 my-2 text-sm text-gray-700 ml-auto"
          onClick={handleShowMore}
        >
          Show More
        </div>
      ) : (
        post?.comments?.filter((comment) => !comment.reply)?.length > 2 && (
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
