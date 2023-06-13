import { User } from "@/types/User";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  postId: string;
  postUserId: string;
  userAuth: User;
}

const InputComment = ({ postId, postUserId, userAuth }: Props) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    const newComment = {
      content,
      likes: [],
      user: userAuth,
      createdAt: new Date().toISOString(),
    };

    console.log(newComment);
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
      <Button variant={"unstyled"} color="blue" type="submit">
        Post
      </Button>
    </form>
  );
};

export default InputComment;
