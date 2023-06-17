import withAuth from "@/hocs/withAuth";
import {
  getPostsAsync,
  getUserPostsAsync,
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

interface Props {
  userId?: string;
  isPostDetails?: boolean;
}
const NewsFeed = ({ userId, isPostDetails = false }: Props) => {
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
    if (postsData) setPosts(postsData);
  }, [postsData]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserPostsAsync(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="grid grid-cols-7 gap-5">
      {!isPostDetails && (
        <div className="col-span-2 p-3">
          <SideBar user={userAuth!} />
        </div>
      )}
      <div className={`${isPostDetails ? "col-span-7" : "col-span-3"}`}>
        {isPostDetails && userId && userId === userAuth?._id ? (
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
            <ModalCreatePost
              isOpen={isOpen}
              onClose={onClose}
              userId={userId}
            />
          </div>
        ) : (
          !isPostDetails && (
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
              <ModalCreatePost
                isOpen={isOpen}
                onClose={onClose}
                userId={userId}
              />
            </div>
          )
        )}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green"
                size="xl"
              />
            </div>
          ) : (
            posts?.map((post: PostData) => (
              <PostCard key={post?._id} post={post} userAuth={userAuth!} />
            ))
          )}
          {posts?.length === 0 && !isLoading && (
            <div className="flex items-center justify-center">
              <p className="text-center text-gray-800">No posts yet.</p>
            </div>
          )}
        </div>
      </div>
      {!isPostDetails && (
        <div className="col-span-2 p-3">
          <Suggestions />
        </div>
      )}
    </div>
  );
};

export default memo(withAuth(NewsFeed));
