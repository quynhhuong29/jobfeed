import {
  deleteComment,
  likeComment,
  unLikeComment,
} from "@/redux/apis/commentAPI";
import { updatePostAction } from "@/redux/reducers/postReducers";
import { useAppDispatch } from "@/redux/store";
import { Comment } from "@/types/Comment";
import { Post, PostData } from "@/types/Posts";
import { User } from "@/types/User";
import {
  Avatar,
  Button,
  IconButton,
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
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HamburgerDotIcon, HeartIcon } from "../icons";
import InputComment from "../InputComment";

interface Props {
  comment: Comment;
  userAuth: User;
  userPost: User;
  post: PostData;
  commentId: string;
  replyComments?: Comment[];
  amountComments?: number;
  setAmountComments?: any;
}
const MAX_CONTENT_LENGTH = 150;

const CommentCard = ({
  userPost,
  comment,
  userAuth,
  post,
  commentId,
  replyComments,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [numberLikes, setNumberLikes] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const [onReply, setOnReply] = useState<any>(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleRemoveComment = async () => {
    if (userPost._id === userAuth?._id || comment.user._id === userAuth?._id) {
      setIsLoading(true);
      try {
        await deleteComment({ _id: comment._id });
        const deleteArr = [
          ...post.comments.filter((cm: any) => cm.reply === comment._id),
          comment,
        ];

        const newPost = {
          ...post,
          comments: post.comments.filter(
            (cm) => !deleteArr.find((da) => cm._id === da._id)
          ),
        };

        dispatch(updatePostAction(newPost));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast.error("Something went wrong");
      }
    }
    onClose();
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const handleLikeComment = async () => {
    if (loadingLike) return;
    try {
      setIsLike(!isLike);
      setNumberLikes(numberLikes + (isLike ? -1 : 1));
      setLoadingLike(true);
      if (!isLike) {
        await likeComment(comment._id);
      } else {
        await unLikeComment(comment._id);
      }
      setLoadingLike(false);
    } catch (err) {
      setLoadingLike(false);
      setIsLike(!isLike);
      setNumberLikes(numberLikes + (isLike ? -1 : 1));
      toast.error("Something went wrong");
    }
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  useEffect(() => {
    if (comment.likes.find((like) => like._id === userAuth?._id)) {
      setIsLike(true);
    }
    setNumberLikes(comment.likes.length);
  }, [comment.likes, userAuth?._id]);

  return (
    <>
      <div className="flex gap-2 px-6 py-3">
        <Avatar size="sm" name="Avatar" src={comment?.user?.avatar || ""} />
        <div className="flex flex-col gap-1 w-full">
          <div className="w-full flex items-center gap-2">
            <div className="rounded-lg p-2 bg-[#E4E6EB] text-sm text-gray-800 w-fit max-w-[380px]">
              {isEdit ? (
                <InputComment
                  userAuth={userAuth}
                  post={post}
                  isEdit
                  comment={comment}
                  setIsEdit={setIsEdit}
                />
              ) : (
                <>
                  <p className="text-xs font-semibold mb-1">{`${comment?.user?.firstName} ${comment?.user?.lastName}`}</p>
                  {comment.tag && comment?.tag?._id !== comment?.user?._id && (
                    <Link
                      href={`/profile/${comment.tag._id}`}
                      className="text-blue w-[30%] mr-1"
                    >
                      @{comment.tag.firstName} {comment.tag.lastName}
                    </Link>
                  )}
                  {expanded || comment?.content?.length <= MAX_CONTENT_LENGTH
                    ? comment?.content
                    : comment?.content?.slice(0, MAX_CONTENT_LENGTH) + "..."}
                  {comment?.content?.length > MAX_CONTENT_LENGTH && (
                    <button
                      className="text-gray-800 font-medium hover:underline ml-1"
                      onClick={handleToggleExpand}
                    >
                      {expanded ? "Hide" : "Read More"}
                    </button>
                  )}
                </>
              )}
            </div>
            <div
              className="flex-1 h-full flex items-center"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              {showMenu && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    size="sm"
                    aria-label="Setting post"
                    icon={
                      <HamburgerDotIcon
                        w="16px"
                        h="16px"
                        fill="#314047"
                        transform="rotate(90deg)"
                      />
                    }
                    sx={{
                      borderRadius: "100%",
                      backgroundColor: "#E4E6EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    variant="unstyled"
                  />
                  <MenuList>
                    {comment?.user?._id === userAuth?._id ? (
                      <>
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={onOpen}>Remove</MenuItem>
                      </>
                    ) : userPost?._id === comment?.postUserId ? (
                      <MenuItem onClick={onOpen}>Remove</MenuItem>
                    ) : (
                      <MenuItem>Hide Comment</MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </div>
          </div>

          {isEdit ? (
            <div
              className="font-medium hover:underline cursor-pointer text-xs text-blue"
              onClick={handleCancelEdit}
            >
              Cancel
            </div>
          ) : (
            <div className="flex text-xs items-center justify-between text-gray-600 ml-1">
              <div className="flex gap-2">
                <div
                  className={`font-medium hover:underline cursor-pointer ${
                    loadingLike
                      ? "opacity-30 cursor-default"
                      : "opacity-100 cursor-pointer"
                  }`}
                  onClick={handleLikeComment}
                >
                  {isLike ? "UnLike" : "Like"}
                </div>
                <div
                  className="font-medium hover:underline cursor-pointer"
                  onClick={handleReply}
                >
                  {onReply ? "Cancel" : "Reply"}
                </div>
                <span>{moment(comment?.createdAt).fromNow()}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {numberLikes || 0}
                <HeartIcon
                  width="18px"
                  height="18px"
                  sx={{
                    fill: "#dc3545",
                    "& path": {
                      stroke: "#dc3545",
                    },
                  }}
                />
              </div>
            </div>
          )}

          {onReply && (
            <div className="rounded-lg p-2 bg-[#E4E6EB] text-sm text-gray-800 w-fit mt-1">
              <InputComment
                userAuth={userAuth}
                post={post}
                onReply={onReply}
                setOnReply={setOnReply}
              >
                <Link
                  href={`${!userAuth?.isCompany ? "" : "/company"}/profile/${
                    onReply.user._id
                  }`}
                  className="text-blue w-[30%]"
                >
                  @{onReply.user.firstName} {onReply.user.lastName}:
                </Link>
              </InputComment>
            </div>
          )}
          {replyComments?.map((commentReply) => {
            if (commentId === commentReply.reply) {
              return (
                <div key={commentReply._id}>
                  <CommentCard
                    key={commentReply._id}
                    comment={commentReply}
                    commentId={commentReply._id}
                    userPost={post.user}
                    userAuth={userAuth}
                    post={post}
                    replyComments={replyComments.filter(
                      (comment) => comment.reply === commentReply._id
                    )}
                  />
                </div>
              );
            }
          })}
        </div>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Comment?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to delete this comment?</ModalBody>

            <ModalFooter sx={{ gap: "4px" }}>
              <Button variant="ghost" onClick={onClose}>
                No
              </Button>
              <Button
                colorScheme="green"
                mr={3}
                onClick={handleRemoveComment}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};
export default CommentCard;
