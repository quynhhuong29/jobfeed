import {
  createCommentAsync,
  selectLoadingNewComment,
} from "@/redux/reducers/commentReducers";
import { updatePostAction } from "@/redux/reducers/postReducers";
import { useAppDispatch } from "@/redux/store";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  userAuth: User;
  post: PostData;
}

const InputComment = ({ post, userAuth }: Props) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState("");

  const isLoading = useSelector(selectLoadingNewComment);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    const newComment = {
      content,
      likes: [],
      user: userAuth,
      createdAt: new Date().toISOString(),
    };

    try {
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
      // await dispatch(getPostsAsync());
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form
      className="flex items-center justify-between gap-2"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Add a comment..."
        sx={{
          flex: 1,
          border: "0",
          fontSize: "14px",
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
      <Button
        variant={"unstyled"}
        color="blue"
        type="submit"
        isLoading={isLoading}
      >
        Post
      </Button>
    </form>
  );
};

export default InputComment;
