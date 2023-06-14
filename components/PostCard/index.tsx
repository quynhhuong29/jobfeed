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
import { getPostsAsync } from "@/redux/reducers/postReducers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InputComment from "../InputComment";
import Comments from "../Comments";

interface Props {
  post: PostData;
  userAuth: User;
}

const MAX_CONTENT_LENGTH = 150;

const PostCard = ({ post, userAuth }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [numberLikes, setNumberLikes] = useState(0);
  const [saved, setSaved] = useState(false);

  const { content, images, _id } = post;

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
      await deletePost(post._id);
      dispatch(getPostsAsync());
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleLikePost = async () => {
    if (isLike && post) {
      try {
        await unLikePost(post._id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await likePost(post._id);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLike(!isLike);
    setNumberLikes(numberLikes + (isLike ? -1 : 1));
  };

  const handleSavePost = async () => {
    if (saved && post) {
      try {
        await unSavePost(post._id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await savePost(post._id);
      } catch (err) {
        console.log(err);
      }
    }

    setSaved(!saved);
  };

  useEffect(() => {
    if (
      post.likes &&
      post.likes.find((like: any) => like._id === userAuth._id)
    ) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post?.likes, userAuth._id]);

  useEffect(() => {
    setNumberLikes(post?.likes?.length);
  }, [post?.likes]);

  useEffect(() => {
    if (userAuth.saved.find((id) => id === post?._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [userAuth.saved, post?._id]);
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg">
      <div className="flex px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar size="md" name="Avatar" src={post?.user?.avatar || ""} />
          <div className="flex flex-col">
            <p className="text-base text-gray-800 font-semibold">{`${post?.user?.firstName} ${post?.user?.lastName}`}</p>
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
            {userAuth._id === post?.user?._id && (
              <>
                <MenuItem onClick={handleEditPost}>Edit</MenuItem>
                <MenuItem onClick={handleRemovePost}>Remove</MenuItem>
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
        />
      </div>
      <div className="flex items-center justify-between px-8 my-1">
        <p className="text-gray-800 font-semibold">{numberLikes} Likes</p>
        <p className="text-gray-800 font-semibold">
          {post?.comments?.length || 0} Comments
        </p>
      </div>
      <div>
        <Comments post={post} />
      </div>
      <div className="border-t border-gray-400 bg-gray-300 py-3 px-5">
        <InputComment
          // postId={post?._id}
          // postUserId={post?.user._id}
          userAuth={userAuth}
          post={post}
        />
      </div>
      {isOpen && (
        <ModalCreatePost
          isOpen={isOpen}
          onClose={onClose}
          isEdit={true}
          data={{ content, images, _id }}
        />
      )}
    </div>
  );
};

export default PostCard;
