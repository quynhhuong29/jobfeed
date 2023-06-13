import withAuth from "@/hocs/withAuth";
import {
  getPostsAsync,
  selectLoadingPost,
  selectPosts,
} from "@/redux/reducers/postReducers";
import { useAppDispatch } from "@/redux/store";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import {
  Avatar,
  Button,
  Spinner,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "../PostCard";
import ModalCreatePost from "./ModalCreatePost";
import SideBar from "./SideBar";
import Suggestions from "./Suggestions";

const NewsFeed = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [userAuth, setUserAuth] = useState<User>();
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<PostData[]>([]);

  const postsData: any[] = useSelector(selectPosts);
  const isLoading = useSelector(selectLoadingPost);

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  useEffect(() => {
    if ((postsData as any)?.posts) setPosts((postsData as any).posts);
  }, [postsData]);

  return (
    <div className="grid grid-cols-7 gap-5">
      <div className="col-span-2 p-3">
        <SideBar user={userAuth!} />
      </div>
      <div className="col-span-3">
        <div className="flex gap-2 mb-4 p-5 rounded-lg bg-white w-full border border-[rgba(0, 0, 0, 0.125)]">
          <WrapItem>
            <Avatar size="md" name="Avatar" src={userAuth?.avatar || ""} />
          </WrapItem>
          <Button
            size="lg"
            sx={{
              width: "100%",
              background: "#f1f1f1",
              borderRadius: "30px",
              color: "#555",
              padding: "0 16px",
              margin: "0 5px",
              textAlign: "left",
              fontWeight: "400",
              display: "block",
              fontSize: "14px",
            }}
            onClick={onOpen}
          >
            What&apos; your job?
          </Button>
          <ModalCreatePost isOpen={isOpen} onClose={onClose} />
        </div>
        <div className="flex flex-col gap-6">
          {isLoading && (
            <div className="flex items-center justify-center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green"
                size="xl"
              />
            </div>
          )}
          {posts?.length === 0 && !isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-center text-gray-800">No posts yet.</p>
            </div>
          )}
          {posts?.map((post: PostData) => (
            <PostCard
              key={post?._id}
              content={post?.content}
              user={post?.user}
              images={post?.images}
              likes={post?.likes}
              comments={post?.comments}
              _id={post?._id}
              createdAt={post?.createdAt}
              userAuth={userAuth!}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2 p-3">
        <Suggestions />
      </div>
    </div>
  );
};

export default memo(withAuth(NewsFeed));
