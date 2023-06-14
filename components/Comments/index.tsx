import { Comment } from "@/types/Comment";
import { PostData } from "@/types/Posts";
import CommentCard from "./CommentCard";

interface Props {
  post: PostData;
}
const Comments = ({ post }: Props) => {
  return (
    <div>
      {post?.comments?.map((comment: Comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
