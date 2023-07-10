import ErrorMessage from "@/components/ErrorMessage";
import { LayoutAdmin } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { deleteUser, updateInfoUser } from "@/redux/apis/adminAPI";
import {
  getAllUserAsync,
  selectUsersAdmin,
} from "@/redux/reducers/adminReducers";
import { selectAuth } from "@/redux/reducers/authReducers";
import { selectUserInfo } from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { DeleteUser } from "@/redux/types/admin.type";
import { User } from "@/types/User";
import { checkImage, imageUpload } from "@/utils/upload.util";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Email is invalid"),
  introduce: yup.string(),
  location: yup.string(),
  website: yup.string(),
  mobile: yup.string(),
});
type FormData = yup.InferType<typeof schema>;

const Admin = () => {
  const dispatch = useAppDispatch();
  const [isAdmin, setIsAdmin] = useState(true);
  const [userDelete, setUserDelete] = useState<DeleteUser>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [avatar, setAvatar] = useState<Blob | MediaSource>();
  const [errorAvatar, setErrorAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
    onOpen: onOpenEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenView,
    onClose: onCloseView,
    onOpen: onOpenView,
  } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const auth = useSelector(selectAuth);
  const users = useSelector(selectUsersAdmin);

  useEffect(() => {
    if (auth?.role !== "admin") {
      setIsAdmin(false);
    }
  }, [auth?.role]);

  useEffect(() => {
    dispatch(getAllUserAsync());
  }, [dispatch]);

  const handleChangeAvatar = (e: any) => {
    const file = e.target.files[0];

    const err = checkImage(file);
    if (err) {
      setErrorAvatar(err);
      return;
    }
    setErrorAvatar("");
    setAvatar(file);
  };

  const handleDelete = async () => {
    if (!userDelete) return;

    setLoadingDelete(true);
    try {
      const response = await deleteUser(userDelete);
      if (response?.msg === "Delete successful") {
        dispatch(getAllUserAsync());
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

  const handleUpdateUserInfo = async (data: any) => {
    setIsLoading(true);
    if (!userData) return;

    let dataRequest = userData;
    let img: any = [];
    if (avatar) {
      img = await imageUpload([avatar]);
    }

    if (data) {
      dataRequest = {
        ...userData,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        introduction: data.introduce,
        address: data.location,
        avatar: img[0]?.url || userData.avatar,
        mobile: data.mobile,
        website: data.website,
      };
    }

    try {
      await updateInfoUser(dataRequest);

      toast.success("Update information success!");
      dispatch(getAllUserAsync());
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      {isAdmin ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-7">Users List</h2>
          <div className="!bg-white shadow-lg">
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Candidates</Tab>
                <Tab>Companies</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Avatar</Th>
                          <Th>Name</Th>
                          <Th>Username</Th>
                          <Th>Email</Th>
                          <Th sx={{ textAlign: "center" }}>Action</Th>
                        </Tr>
                      </Thead>
                      {users?.isLoading ? (
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
                          {users &&
                            users.data
                              ?.filter(
                                (user: User) => user.role === "candidate"
                              )
                              ?.map((user: User) => (
                                <Tr key={user?._id}>
                                  <Td>
                                    <Avatar
                                      src={user?.avatar}
                                      name={user?.username}
                                    />
                                  </Td>
                                  <Td>{user?.username}</Td>
                                  <Td>
                                    {user?.firstName + " " + user?.lastName}
                                  </Td>
                                  <Td>{user?.email}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<EditIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        if (!user) return;

                                        setUserData(user);

                                        setValue("firstName", user.firstName);
                                        setValue("lastName", user.lastName);
                                        setValue("email", user.email);
                                        setValue(
                                          "introduce",
                                          user.introduction
                                        );
                                        setValue("location", user.address);
                                        setValue("website", user.website || "");
                                        setValue("mobile", user.mobile || "");

                                        onOpenEdit();
                                      }}
                                    />
                                    <IconButton
                                      aria-label="Delete"
                                      icon={<DeleteIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        setUserDelete({
                                          _id: user?._id,
                                          role: user?.role,
                                        });
                                        onOpen();
                                      }}
                                    />
                                    <IconButton
                                      aria-label="View"
                                      icon={<ViewIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        if (!user) return;
                                        setUserData(user);

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
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="striped" colorScheme="green">
                      <Thead>
                        <Tr>
                          <Th>Avatar</Th>
                          <Th>Company Name</Th>
                          <Th>Username</Th>
                          <Th>Email</Th>
                          <Th sx={{ textAlign: "center" }}>Action</Th>
                        </Tr>
                      </Thead>
                      {users?.isLoading ? (
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
                          {users &&
                            users.data
                              ?.filter((user: User) => user.role === "company")
                              ?.map((user: User) => (
                                <Tr key={user?._id}>
                                  <Td>
                                    <Avatar
                                      src={user?.avatar}
                                      name={user?.username}
                                    />
                                  </Td>
                                  <Td>{user?.username}</Td>
                                  <Td>{user?.firstName}</Td>
                                  <Td>{user?.email}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<EditIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        if (!user) return;

                                        setUserData(user);

                                        setValue("firstName", user.firstName);
                                        setValue("lastName", user.lastName);
                                        setValue("email", user.email);
                                        setValue(
                                          "introduce",
                                          user.introduction
                                        );
                                        setValue("location", user.address);
                                        setValue("website", user.website || "");
                                        setValue("mobile", user.mobile || "");

                                        onOpenEdit();
                                      }}
                                    />
                                    <IconButton
                                      aria-label="Delete"
                                      icon={<DeleteIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        setUserDelete({
                                          _id: user?._id,
                                          role: user?.role,
                                        });
                                        onOpen();
                                      }}
                                    />
                                    <IconButton
                                      aria-label="View"
                                      icon={<ViewIcon />}
                                      variant="ghost"
                                      onClick={() => {
                                        if (!user) return;

                                        setUserData(user);
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
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete User?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to delete this user?</ModalBody>

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

          <Drawer
            isOpen={isOpenEdit}
            placement="right"
            onClose={onCloseEdit}
            size="lg"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                Update User Information
              </DrawerHeader>

              <DrawerBody>
                <form
                  className="mt-4"
                  onSubmit={handleSubmit(handleUpdateUserInfo)}
                >
                  <div className="mt-4">
                    <div className="flex justify-center mb-4">
                      <div>
                        <div className="relative">
                          <div className="border border-gray-300 bg-white rounded-full p-1">
                            <WrapItem>
                              <Avatar
                                size="2xl"
                                name={userData?.firstName}
                                src={
                                  avatar
                                    ? URL.createObjectURL(avatar)
                                    : userData?.avatar
                                }
                              />
                            </WrapItem>
                          </div>
                          <div className="absolute cursor-pointer bg-white rounded-full right-1 z-10 bottom-4 flex items-center justify-center">
                            <Button
                              variant="unstyled"
                              size="sm"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <EditIcon />
                              <Input
                                type="file"
                                height="100%"
                                width="100%"
                                position="absolute"
                                top="0"
                                left="0"
                                opacity="0"
                                aria-hidden="true"
                                accept="image/*"
                                cursor="pointer"
                                onChange={handleChangeAvatar}
                              />
                            </Button>
                          </div>
                        </div>
                        {errorAvatar && <ErrorMessage message={errorAvatar} />}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="text-[15px] mb-2 inline-block"
                        >
                          First Name
                        </label>
                        <Input
                          type="text"
                          id="firstName"
                          defaultValue={"firstName"}
                          placeholder="Enter your first name"
                          autoComplete="off"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("firstName")}
                        />
                        {errors.firstName && (
                          <ErrorMessage message={errors.firstName.message} />
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Last Name
                        </label>
                        <Input
                          type="text"
                          id="lastName"
                          defaultValue={"lastName"}
                          placeholder="Enter your last name"
                          autoComplete="off"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("lastName")}
                        />
                        {errors.lastName && (
                          <ErrorMessage message={errors.lastName.message} />
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Email
                        </label>
                        <Input
                          type="email"
                          id="email"
                          defaultValue={"email"}
                          placeholder="Enter your email"
                          autoComplete="off"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("email")}
                        />
                        {errors.email && (
                          <ErrorMessage message={errors.email.message} />
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="mobile"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Phone number
                        </label>
                        <Input
                          type="number"
                          id="mobile"
                          defaultValue={"mobile"}
                          placeholder="Enter your mobile"
                          autoComplete="off"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("mobile")}
                        />
                        {errors.mobile && (
                          <ErrorMessage message={errors.mobile.message} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      Profile
                    </h5>
                    <div className="mb-4">
                      <label
                        htmlFor="introduce"
                        className="text-[15px] mb-2 inline-block"
                      >
                        Introduce Yourself
                      </label>
                      <Textarea
                        id="introduce"
                        placeholder="Say something..."
                        autoComplete="off"
                        defaultValue={"introduce"}
                        sx={{
                          minHeight: "125px",
                          backgroundColor: "#fff",
                          border: "1px solid #dbdfe2",
                          color: "#495057",
                          padding: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          "&:focus-visible": {
                            outline: "0",
                            border: "1px solid #dbdfe2",
                            boxShadow: "none",
                          },
                        }}
                        {...register("introduce")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="website"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Website
                        </label>
                        <Input
                          type="url"
                          id="website"
                          defaultValue={"website"}
                          placeholder="Enter your website"
                          autoComplete="off"
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("website")}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="location"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Location
                        </label>
                        <Input
                          type="text"
                          id="location"
                          placeholder="Enter your location"
                          autoComplete="off"
                          defaultValue={"location"}
                          sx={{
                            backgroundColor: "#fff",
                            border: "1px solid #dbdfe2",
                            color: "#495057",
                            padding: "10px",
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:focus-visible": {
                              outline: "0",
                              border: "1px solid #dbdfe2",
                              boxShadow: "none",
                            },
                          }}
                          {...register("location")}
                        />
                        {errors.location && (
                          <ErrorMessage message={errors.location.message} />
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </DrawerBody>

              <DrawerFooter borderTopWidth="1px">
                <Button variant="outline" mr={3} onClick={onCloseEdit}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  onClick={handleSubmit(handleUpdateUserInfo)}
                  isLoading={isLoading}
                >
                  Update
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Drawer
            isOpen={isOpenView}
            placement="right"
            onClose={onCloseView}
            size="lg"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                User Information
              </DrawerHeader>

              <DrawerBody>
                <div className="mt-4">
                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      {userData?.role === "candidate"
                        ? userData?.firstName + " " + userData?.lastName
                        : userData?.firstName}
                    </h5>
                    <div className="flex justify-center mb-4">
                      <div>
                        <div className="relative">
                          <div className="border border-gray-300 bg-white rounded-full p-1">
                            <WrapItem>
                              <Avatar
                                size="2xl"
                                name={userData?.firstName}
                                src={
                                  avatar
                                    ? URL.createObjectURL(avatar)
                                    : userData?.avatar
                                }
                              />
                            </WrapItem>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      About
                    </h5>
                    <p className="mt-6 mb-4 text-gray-600 text-base">
                      {userData?.introduction}
                    </p>
                  </div>
                  <h5 className="text-lg text-gray-700 mb-2 font-bold">
                    Information
                  </h5>
                  <div className="flex items-center my-1">
                    <p className="text-gray-700 text-base font-medium min-w-[120px]">
                      Email:
                    </p>
                    <span className="break-words text-gray-600 text-base">
                      {userData?.email}
                    </span>
                  </div>
                  <div className="flex items-center my-1">
                    <p className="text-gray-700 text-base font-medium min-w-[120px]">
                      Location:
                    </p>
                    <span className="break-words text-gray-600 text-base">
                      {userData?.address}
                    </span>
                  </div>
                  <div className="flex items-center my-1">
                    <p className="text-gray-700 text-base font-medium min-w-[120px]">
                      Phone Number:
                    </p>
                    <span className="break-words text-gray-600 text-base">
                      {userData?.mobile}
                    </span>
                  </div>
                  <div className="flex items-center my-1">
                    <p className="text-gray-700 text-base font-medium min-w-[120px]">
                      Website:
                    </p>
                    <Link href={userData?.website || ""} target={"_blank"}>
                      <span className="break-words text-gray-600 text-base hover:underline">
                        {userData?.website}
                      </span>
                    </Link>
                  </div>
                </div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
