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
import { Image } from "@/types/Posts";
import ModalCreatePost from "../JobFeedPage/ModalCreatePost";

interface Props {
  content: string;
  likes: string[];
  comments: string[];
  images: Image[];
  _id: string;
  user: User;
  createdAt: string;
  userAuth: User;
}

const JobCard = ({
  content,
  likes,
  comments,
  images,
  _id,
  user,
  createdAt,
  userAuth,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
  const handleRemovePost = () => {};

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg">
      <div className="flex px-6 py-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar size="md" name="Avatar" src={user?.avatar || ""} />
          <div className="flex flex-col">
            <p className="text-base text-gray-800 font-semibold">{`${user?.firstName} ${user?.lastName}`}</p>
            <span className="text-[15px] text-gray-600 font-normal">
              20 minutes ago
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
            {userAuth._id === user._id && (
              <>
                <MenuItem onClick={handleEditPost}>Edit</MenuItem>
                <MenuItem onClick={handleRemovePost}>Remove</MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      </div>
      <div className="px-6 mb-3 text-base text-gray-800">{content || ""}</div>
      <div className="mb-2">
        <Slider {...settings}>
          {images?.map((image, index) => (
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
                  // fill: "#dc3545",
                  // "& path": { stroke: "#dc3545" },
                  opacity: 0.3,
                }}
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
                // fill: "#17a2b8",
                // "& path": { stroke: "#17a2b8" },
                opacity: 0.3,
              }}
            />
          }
          variant="unstyled"
        />
      </div>
      <div className="flex items-center justify-between px-8 my-1">
        <p className="text-gray-800 font-semibold">
          {likes?.length || 0} Likes
        </p>
        <p className="text-gray-800 font-semibold">
          {comments?.length || 0} Comments
        </p>
      </div>
      <div className="border-t border-gray-400 bg-gray-300 py-3 px-5 flex items-center justify-between gap-2">
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
        />
        <Button variant={"unstyled"} color="blue">
          Post
        </Button>
      </div>
      <ModalCreatePost
        isOpen={isOpen}
        onClose={onClose}
        isEdit={true}
        data={{ content, images, _id }}
      />
    </div>
  );
};

export default JobCard;
