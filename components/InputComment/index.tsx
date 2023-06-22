import { createNotify } from "@/redux/apis/notifyAPI";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  createCommentAsync,
  selectLoading,
  selectLoadingNewComment,
  updateCommentAsync,
} from "@/redux/reducers/commentReducers";
import { updatePostAction } from "@/redux/reducers/postReducers";
import { selectSocket } from "@/redux/reducers/socketReducers";
import { useAppDispatch } from "@/redux/store";
import { Comment } from "@/types/Comment";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Icons from "../Icons";

interface Props {
  userAuth: User;
  post: PostData;
  isEdit?: boolean;
  comment?: Comment;
  setIsEdit?: (isEdit: boolean) => void;
  onReply?: any;
  setOnReply?: (onReply: any) => void;
  children?: any;
}

const InputComment = ({
  post,
  userAuth,
  isEdit = false,
  comment,
  setIsEdit,
  onReply,
  setOnReply,
  children,
}: Props) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const isLoading = useSelector(selectLoadingNewComment);
  const socket = useSelector(selectSocket);
  const auth = useSelector(selectAuth);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    let newComment = {
      content,
      likes: [],
      user: userAuth,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
    };

    try {
      if (!isEdit) {
        if (onReply?.commentId) setIsLoadingReply(true);
        const response = await dispatch(
          createCommentAsync({ newComment, post, socket: null })
        ).unwrap();

        const updatedPost = {
          ...post,
          comments: [
            ...post.comments,
            { ...response?.newComment, user: userAuth },
          ],
        };
        dispatch(updatePostAction(updatedPost));
        // Socket
        socket?.emit("createComment", updatedPost);

        // Notify
        const msg = {
          id: response.newComment._id,
          text: response?.newComment.reply
            ? "mentioned you in a comment."
            : "has commented on your post.",
          recipients: response?.newComment.reply
            ? [response?.newComment.tag._id]
            : [post.user._id],
          url: `/post/${post._id}`,
          content: post.content,
          image: post.images[0]?.url ? post.images[0]?.url : "",
        };

        const res = await createNotify(msg);
        socket?.emit("createNotify", {
          ...res.notify,
          user: {
            username: auth?.data?.user.username,
            avatar: auth?.data?.user.avatar,
            fullName:
              auth.role !== "company"
                ? auth?.data?.user.firstName + " " + auth?.data?.user.lastName
                : auth?.data?.user.lastName,
          },
        });

        if (setOnReply) return setOnReply(false);
        if (onReply?.commentId) setIsLoadingReply(false);
        setContent("");
      } else {
        setIsLoadingUpdate(true);
        if (!comment || !content.trim() || content.trim() === comment.content) {
          if (setIsEdit) {
            setIsEdit(false);
          }
          return;
        }

        await dispatch(
          updateCommentAsync({
            _id: comment._id,
            content,
          })
        ).unwrap();
        setIsLoadingUpdate(false);

        let newComments = post.comments.find((cm) => cm._id === comment._id);
        if (newComments) newComments = { ...newComments, content: content };
        const updatedPost = {
          ...post,
          comments: post.comments.map((cm) =>
            cm._id === comment._id ? newComments : cm
          ),
        };

        dispatch(updatePostAction(updatedPost));
        if (setIsEdit) setIsEdit(false);
      }
    } catch (err: any) {
      if (err.message) toast.error(err.message);
      else toast.error("Something went wrong. Please try again.");
      if (onReply?.commentId) setIsLoadingReply(false);
    }
  };

  useEffect(() => {
    if (!comment) return;
    setContent(comment.content);
  }, [comment]);

  return (
    <form
      className={`flex items-center justify-between ${
        onReply ? "gap-1" : "gap-2"
      } min-w-[300px]`}
      onSubmit={handleSubmit}
    >
      {children}
      {isEdit || onReply ? (
        <Textarea
          placeholder="Add a comment..."
          sx={{
            flex: 1,
            border: "0",
            fontSize: "14px",
            padding: isEdit || onReply ? "0" : "0 16px",
            "&:focus-visible": {
              outline: "0",
              border: "none",
              boxShadow: "none",
            },
            "&:hover": {
              border: "none",
            },
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <Input
          placeholder="Add a comment..."
          sx={{
            flex: 1,
            border: "0",
            fontSize: "14px",
            padding: isEdit ? "0" : "0 16px",
            "&:focus-visible": {
              outline: "0",
              border: "none",
              boxShadow: "none",
            },
            "&:hover": {
              border: "none",
            },
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
      <Icons setContent={setContent} content={content} />
      {onReply?.commentId ? (
        <Button
          variant={"unstyled"}
          color="blue"
          type="submit"
          isLoading={isLoadingReply}
        >
          Post
        </Button>
      ) : (
        <Button
          variant={"unstyled"}
          color="blue"
          type="submit"
          isLoading={(isEdit ? isLoadingUpdate : isLoading) as boolean}
        >
          Post
        </Button>
      )}
    </form>
  );
};

export default InputComment;
