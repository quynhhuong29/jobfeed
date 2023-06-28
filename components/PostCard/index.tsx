/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  Button,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BookMarkIcon,
  CommentIcon,
  HeartIcon,
  MenuVerticalIcon,
  PaperPlaneIcon,
} from "../icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { User } from "@/types/User";
import { Image, PostData } from "@/types/Posts";
import ModalCreatePost from "../JobFeedPage/ModalCreatePost";
import moment from "moment";
import { toast } from "react-toastify";
import {
  deletePost,
  likePost,
  savePost,
  unLikePost,
  unSavePost,
} from "@/redux/apis/postApi";
import { useAppDispatch } from "@/redux/store";
import {
  deletePostAction,
  getPostsAsync,
  selectPosts,
  updatePostAction,
  updatePostAsync,
} from "@/redux/reducers/postReducers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputComment from "../InputComment";
import Comments from "../Comments";
import Link from "next/link";
import { selectSocket } from "@/redux/reducers/socketReducers";
import { selectAuth } from "@/redux/reducers/authReducers";
import { createNotify, removeNotify } from "@/redux/apis/notifyAPI";
import { removeNotifyAsync } from "@/redux/reducers/notifyReducers";

interface Props {
  post: PostData;
  userAuth: User;
}

const MAX_CONTENT_LENGTH = 150;

const PostCard = ({ post, userAuth }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onClose: onCloseDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { content, images, _id } = post;

  const socket = useSelector(selectSocket);
  const auth = useSelector(selectAuth);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ position: "absolute", bottom: 0 }}>
        <ul style={{ margin: 0 }}>{dots}</ul>
      </div>
    ),
  };

  const handleEditPost = () => {
    onOpen();
  };
  const handleRemovePost = async () => {
    try {
      setLoadingDelete(true);
      const res = await deletePost(post._id);
      dispatch(deletePostAction({ _id: post._id }));

      // Notify
      const msg = {
        id: post._id,
        text: "added a new post.",
        recipients: res.newPost.user.followers,
        url: `/post/${post._id}`,
      };
      dispatch(removeNotifyAsync({ msg, socket }));

      toast.success("Post deleted successfully");
      setLoadingDelete(false);
    } catch (err: any) {
      setLoadingDelete(false);
      toast.error(err);
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleLikePost = async () => {
    if (loadingLike) return;

    if (isLike && post) {
      try {
        setIsLike(false);

        if (socket && socket?.emit) {
          const newPost = {
            ...post,
            likes: post.likes.filter(
              (like: any) => like._id !== auth?.data?.user?._id
            ),
          };
          dispatch(updatePostAction(newPost));
          socket?.emit("unLikePost", newPost);
        }
        await unLikePost(post._id);

        // Notify
        const msg = {
          id: auth.data.user._id,
          text: "like your post.",
          recipients: [post.user._id],
          url: `/post/${post._id}`,
        };
        dispatch(removeNotifyAsync({ msg, socket }));

        setLoadingLike(false);
      } catch (err) {
        setIsLike(true);
        setLoadingLike(false);
      }
    } else {
      try {
        setIsLike(true);
        if (socket && socket?.emit) {
          const newPost = { ...post, likes: [...post.likes, auth?.data?.user] };
          dispatch(updatePostAction(newPost));
          socket?.emit("likePost", newPost);
        }
        await likePost(post._id);

        // Notify
        const msg = {
          id: auth.data.user._id,
          text: "like your post.",
          recipients: [post.user._id],
          url: `/post/${post._id}`,
          content: post.content,
          image: post.images[0]?.url ? post.images[0]?.url : "",
        };

        const res = await createNotify(msg);
        socket?.emit("createNotify", {
          ...res.notify,
          user: {
            username: auth.data.user.username,
            avatar: auth.data.user.avatar,
            fullName:
              auth.role !== "company"
                ? auth.data.user.firstName + " " + auth.data.user.lastName
                : auth.data.user.lastName,
          },
        });

        setLoadingLike(false);
      } catch (err) {
        setLoadingLike(false);
        setIsLike(false);
      }
    }
  };

  const handleSavePost = async () => {
    if (loadingSaved) return;

    setSaved(!saved);
    setLoadingSaved(true);
    if (saved && post) {
      try {
        await unSavePost(post._id);
        setLoadingSaved(false);
      } catch (err) {
        setSaved(!saved);
        setLoadingSaved(false);
      }
    } else {
      try {
        await savePost(post._id);
        setLoadingSaved(false);
      } catch (err) {
        setSaved(!saved);
        setLoadingSaved(false);
      }
    }
  };

  useEffect(() => {
    if (
      post.likes &&
      post.likes.find((like: any) => like._id === userAuth?._id)
    ) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post?.likes, userAuth?._id]);

  useEffect(() => {
    if (userAuth?.saved?.find((id) => id === post?._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [userAuth?.saved, post?._id]);
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg">
      <div className="flex px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar size="md" name="Avatar" src={post?.user?.avatar || ""} />
          <div className="flex flex-col">
            <Link
              className="text-base text-gray-800 font-semibold cursor-pointer hover:underline"
              href={`/profile/${post?.user?._id}`}
            >{`${post?.user?.firstName} ${post?.user?.lastName}`}</Link>
            <span className="text-[15px] text-gray-600 font-normal">
              {moment(post?.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<MenuVerticalIcon width="20px" height="20px" />}
            variant="unstyled"
          />
          <MenuList>
            {userAuth?._id === post?.user?._id && (
              <>
                <MenuItem onClick={handleEditPost}>Edit</MenuItem>
                <MenuItem onClick={onOpenDelete}>Remove</MenuItem>
              </>
            )}
            <MenuItem onClick={() => {}}>Copy link</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="px-6 mb-3 text-base text-gray-800">
        {expanded || post?.content.length <= MAX_CONTENT_LENGTH
          ? post?.content
          : post?.content.slice(0, MAX_CONTENT_LENGTH) + "..."}
        {post?.content.length > MAX_CONTENT_LENGTH && (
          <button className="text-green-400 ml-1" onClick={handleToggleExpand}>
            {expanded ? "Hide" : "Read More"}
          </button>
        )}
      </div>
      <div className="mb-2">
        <Slider {...settings}>
          {post?.images?.map((image, index) => (
            <div className="w-full h-auto" key={index}>
              <img src={image?.url} alt={""} />
            </div>
          ))}
        </Slider>
      </div>
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-1">
          <IconButton
            aria-label="Like post"
            icon={
              <HeartIcon
                width="32px"
                height="32px"
                _hover={{
                  opacity: 0.3,
                }}
                sx={{
                  fill: isLike ? "#dc3545" : "none",
                  "& path": {
                    stroke: isLike ? "#dc3545" : "#000000",
                  },
                }}
                onClick={handleLikePost}
              />
            }
            variant="unstyled"
            sx={{
              opacity: loadingLike ? 0.5 : 1,
            }}
          />
          <IconButton
            aria-label="Like post"
            icon={
              <CommentIcon
                width="32px"
                height="32px"
                _hover={{
                  opacity: 0.3,
                }}
              />
            }
            variant="unstyled"
          />
          <IconButton
            aria-label="Like post"
            icon={
              <PaperPlaneIcon
                width="32px"
                height="32px"
                _hover={{
                  opacity: 0.3,
                }}
              />
            }
            variant="unstyled"
          />
        </div>
        <IconButton
          aria-label="Like post"
          icon={
            <BookMarkIcon
              width="32px"
              height="32px"
              _hover={{
                opacity: 0.3,
              }}
              sx={{
                fill: saved ? "#17a2b8" : "none",
                "& path": {
                  stroke: saved ? "#17a2b8" : "#000000",
                },
              }}
              onClick={handleSavePost}
            />
          }
          variant="unstyled"
          sx={{
            opacity: loadingSaved ? 0.5 : 1,
          }}
        />
      </div>
      <div className="flex items-center justify-between px-8 mt-1 border-y border-gray-400 py-2">
        <p className="text-gray-800 font-semibold">
          {post?.likes?.length} Likes
        </p>
        <p className="text-gray-800 font-semibold">
          {post?.comments?.length || 0} Comments
        </p>
      </div>
      <div>
        <Comments post={post} userAuth={userAuth} />
      </div>
      <div className="border-t border-gray-400 bg-gray-300 py-3 px-5">
        <InputComment userAuth={userAuth} post={post} />
      </div>
      {isOpen && (
        <ModalCreatePost
          isOpen={isOpen}
          onClose={onClose}
          isEdit={true}
          data={{ content, images, _id }}
        />
      )}
      <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this post?</ModalBody>

          <ModalFooter sx={{ gap: "4px" }}>
            <Button variant="ghost" onClick={onCloseDelete}>
              No
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleRemovePost}
              isLoading={loadingDelete}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostCard;
