import ErrorMessage from "@/components/ErrorMessage";
import { LayoutAdmin } from "@/components/layout";
import PostCard from "@/components/PostCard";
import withAuth from "@/hocs/withAuth";
import { deletePost, deleteUser, updateInfoUser } from "@/redux/apis/adminAPI";
import {
  getAllPostsAsync,
  getAllUserAsync,
  selectPostsAdmin,
  selectUsersAdmin,
} from "@/redux/reducers/adminReducers";
import { selectAuth } from "@/redux/reducers/authReducers";
import { selectUserInfo } from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { DeleteUser } from "@/redux/types/admin.type";
import { PostData } from "@/types/Posts";
import { User } from "@/types/User";
import { checkImage, imageUpload } from "@/utils/upload.util";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";

const Admin = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [isAdmin, setIsAdmin] = useState(true);
  const [idDelete, setIdDelete] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenView,
    onClose: onCloseView,
    onOpen: onOpenView,
  } = useDisclosure();

  const auth = useSelector(selectAuth);
  const posts = useSelector(selectPostsAdmin);

  useEffect(() => {
    if (auth?.role !== "admin") {
      setIsAdmin(false);
    }
  }, [auth?.role]);

  useEffect(() => {
    dispatch(getAllUserAsync());
    dispatch(getAllPostsAsync());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!idDelete) return;

    setLoadingDelete(true);
    try {
      const response = await deletePost(idDelete);
      if (response?.msg === "Deleted Post!") {
        dispatch(getAllPostsAsync());
        toast.success("Delete Post!");
      } else {
        toast.error(response?.msg);
      }
      setLoadingDelete(false);
      onClose();
    } catch (error) {
      console.log(error);
      setLoadingDelete(false);
    }
  };

  return (
    <LayoutAdmin>
      {isAdmin ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-7">List Jobs Feed</h2>
          <div className="!bg-white shadow-lg">
            <TableContainer sx={{ maxHeight: "600px", overflowY: "auto" }}>
              <Table variant="striped" colorScheme="green">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Username</Th>
                    <Th>Content</Th>
                    <Th sx={{ textAlign: "center" }}>Likes</Th>
                    <Th sx={{ textAlign: "center" }}>Comment</Th>
                    <Th sx={{ textAlign: "center" }}>Action</Th>
                  </Tr>
                </Thead>
                {posts?.isLoading ? (
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
                  <Tbody>
                    {posts &&
                      posts.data?.map((post: PostData) => (
                        <Tr key={post?._id}>
                          <Td>{post?._id}</Td>
                          <Td>{post?.user?.username}</Td>
                          <Td>{post?.content?.slice(0, 30) + "..."}</Td>
                          <Td sx={{ textAlign: "center" }}>
                            {post?.likes?.length}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {post?.comments?.length}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              variant="ghost"
                              onClick={() => {
                                onOpen();
                                setIdDelete(post?._id);
                              }}
                            />
                            <IconButton
                              aria-label="View"
                              icon={<ViewIcon />}
                              variant="ghost"
                              onClick={() => {
                                setSelectedPost(post);
                                onOpenView();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                )}
              </Table>
            </TableContainer>
          </div>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Post?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to delete this post?</ModalBody>

              <ModalFooter sx={{ gap: "4px" }}>
                <Button variant="ghost" onClick={onClose}>
                  No
                </Button>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={() => handleDelete()}
                  isLoading={loadingDelete}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpenView} onClose={onCloseView} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedPost && (
                  <PostCard post={selectedPost} userAuth={selectedPost?.user} />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl font-bold">
            You are not authenticated to access this page.
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
};

export default withAuth(Admin);
