/* eslint-disable @next/next/no-img-element */
import CustomBadge from "@/components/CustomBadge";
import FooterAlt from "@/components/FooterAlt";
import {
  FacebookIcon,
  FileIcon,
  LinkedInIcon,
  MessengerIcon,
  TwitterIcon,
} from "@/components/icons";
import HomeIcon from "@/components/icons/HomeIcon";
import { useDebounce } from "@/hooks/debounceHook";
import {
  getUserInfoByIdAsync,
  searchUserAsync,
  selectSearchUser,
  selectUserInfo,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import {
  ChevronRightIcon,
  DownloadIcon,
  EditIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import LayoutMain from "../../components/layout/LayoutMain";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { checkImage, imageUpload } from "@/utils/upload.util";
import { updateInfoUser } from "@/redux/apis/userAPI";
import withAuth from "@/hocs/withAuth";
import {
  changePasswordAsync,
  selectAuth,
  selectIsLoggedIn,
} from "@/redux/reducers/authReducers";
import { User } from "@/types/User";
import FollowButton from "@/components/FollowButton";
import ModalFollower from "@/components/ModalFollower";
import { toast } from "react-toastify";
import NewsFeed from "@/components/JobFeedPage/NewsFeed";
import {
  getSavedPostsAsync,
  selectLoadingPost,
  selectSavedPosts,
} from "@/redux/reducers/postReducers";
import PostCard from "@/components/PostCard";
import { PostData } from "@/types/Posts";

const schema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Email is invalid"),
  introduce: yup.string(),
  location: yup.string(),
  languages: yup.string(),
  mobile: yup.string(),
});

const schemaPassword = yup.object().shape({
  currentPassword: yup
    .string()
    .test(
      "empty-check",
      "Password must be at least 6 characters",
      (currentPassword) => currentPassword!.length >= 6
    ),
  newPassword: yup
    .string()
    .test(
      "empty-check",
      "Password must be at least 6 characters",
      (newPassword) => newPassword!.length >= 6
    ),
  confirmPassword: yup
    .string()
    .test(
      "empty-check",
      "Password must be at least 6 characters",
      (confirmPassword) => confirmPassword!.length >= 6
    )
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
});

type FormData = yup.InferType<typeof schema>;
type FormDataPassword = yup.InferType<typeof schemaPassword>;

const url = "https://api.cloudinary.com/v1_1/davidchoi15052000/image/upload";

function Profile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchValue, setSearchValue] = useState<any>();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<Blob | MediaSource>();
  const [errorAvatar, setErrorAvatar] = useState<string>("");
  const [userData, setUserData] = useState<User>();
  const [userAuth, setUserAuth] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeModalFollow, setTypeModalFollow] = useState("");
  const [fileUpload, setFileUpload] = useState<any>();

  const isAuthenticated = useSelector(selectIsLoggedIn);
  const searchUserData = useSelector(selectSearchUser);
  const userInfoData = useSelector(selectUserInfo);
  const loadingAuth = useSelector(selectAuth)?.isLoading;
  const savedPosts = useSelector(selectSavedPosts);
  const loadingSavedPosts = useSelector(selectLoadingPost);

  const modalRef = useRef<any>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit: handleSubmitPassword,
    register: registerPassword,
    formState: { errors: errorsPassword },
    setValue: setValuePassword,
  } = useForm<FormDataPassword>({
    mode: "onChange",
    resolver: yupResolver(schemaPassword),
  });

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchValue(event.target.value);
  };

  const searchUsers = () => {
    if (searchValue) {
      setOpen(true);
      dispatch(searchUserAsync(searchValue));
    }
  };

  useDebounce(searchValue, 500, searchUsers);

  const handleSelectUser = (id: string) => {
    setOpen(false);
    setSearchValue("");

    router.push(`/profile/${id}`);
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
      };
    }

    try {
      await updateInfoUser(dataRequest);
      if (router.query.id)
        dispatch(getUserInfoByIdAsync(router.query.id.toString()));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (data: any) => {
    if (data) {
      try {
        let dataRequest = {
          current_password: data.currentPassword,
          new_password: data.newPassword,
          cf_password: data.confirmPassword,
        };
        await dispatch(changePasswordAsync(dataRequest)).unwrap();

        setValuePassword("currentPassword", "");
        setValuePassword("newPassword", "");
        setValuePassword("confirmPassword", "");
        toast.success("Change password successfully");
      } catch (err: any) {
        if (err.message) toast.error(err.message);
        else toast.error("Something went wrong. Please try again.");
      }
    }
  };

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

  const handleModalFollower = (type: "followers" | "following") => {
    onOpen();
    if (type === "followers") {
      setTypeModalFollow("followers");
    } else {
      setTypeModalFollow("following");
    }
  };

  const handleFileUpload = async (event: any) => {
    // const file = event.target?.files[0];
    const { files } = event.target as HTMLInputElement;

    const file = files?.length ? files[0] : null;

    if (!file) return;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
      });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!router.query.id || !isAuthenticated) return;
    dispatch(getUserInfoByIdAsync(router.query.id.toString()));
  }, [dispatch, router.query.id, isAuthenticated]);

  useEffect(() => {
    onClose();
    if (!userInfoData) return;
    setUserData(userInfoData.data);

    setValue("firstName", userInfoData.data.firstName);
    setValue("lastName", userInfoData.data.lastName);
    setValue("email", userInfoData.data.email);
    setValue("introduce", userInfoData.data.introduction);
    setValue("location", userInfoData.data.address);
    setValue("languages", userInfoData.data.languages || "");
    setValue("mobile", userInfoData.data.mobile || "");
  }, [userInfoData, setValue, onClose]);

  useEffect(() => {
    dispatch(getSavedPostsAsync());
  }, [dispatch]);

  return (
    <LayoutMain>
      <section className="w-full bg-white shadow-[0_3px_10px_0_rgba(49,64,71,.08)] relative py-5">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between">
          <div className="relative mx-auto">
            <InputGroup w={"300px"}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="search"
                placeholder="Enter to Search..."
                value={searchValue || ""}
                sx={{ backgroundColor: "white" }}
                onChange={handleChangeSearch}
              />
            </InputGroup>
            {open && searchValue && (
              <div
                ref={modalRef}
                className="w-[300px] z-10 min-h-[100px] max-h-80 overflow-y-auto bg-white rounded-lg mt-1 absolute py-4"
              >
                {!searchUserData?.isLoading &&
                  searchUserData?.data?.map((ele: any) => (
                    <div
                      key={ele["_id"]}
                      className="flex items-center gap-4 cursor-pointer py-2 px-4 hover:bg-gray-300"
                      onClick={() => handleSelectUser(ele["_id"])}
                    >
                      <img
                        alt="avatar"
                        src={
                          ele?.avatar ||
                          "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
                        }
                        className="rounded-full w-9 h-9"
                      />
                      <div className="flex flex-col">
                        <p className="text-base text-gray-800">
                          {ele?.username}
                        </p>
                        <span className="text-xs">{`${ele?.firstName} ${ele?.lastName}`}</span>
                      </div>
                    </div>
                  ))}
                {searchUserData?.isLoading && (
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
                {searchUserData?.data.length === 0 &&
                  !searchUserData?.isLoading && (
                    <div className="flex items-center justify-center">
                      <p>No result found!</p>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={"unstyled"}
              onClick={() => router.push("/jobfeed")}
            >
              <HomeIcon fill="#02AF74" />
            </Button>
            <Button
              variant={"unstyled"}
              onClick={() => router.push("/jobfeed")}
            >
              <MessengerIcon />
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Profile</h3>
          </div>
        </div>
      </section>
      <section className="w-full bg-white relative py-20">
        <div className="md:max-w-[1140px] mx-auto grid grid-cols-3 gap-5">
          <div className="border border-gray-300 rounded-lg p-6 h-fit">
            <div className="flex flex-col items-center justify-center border-b border-gray-300 pb-4">
              <div className="border border-gray-300 bg-white rounded-full p-1">
                <WrapItem>
                  <Avatar
                    size="lg"
                    name={userInfoData?.data?.firstName}
                    src={userInfoData?.data?.avatar}
                  />
                </WrapItem>
              </div>

              <h5 className="mt-6 text-gray-700 font-semibold text-lg capitalize">
                {`${userInfoData?.data?.firstName || ""} ${
                  userInfoData?.data?.lastName || ""
                }`}
              </h5>
              <p className="text-gray-600 mb-4">Developer</p>
              <div className="flex items-center gap-8 text-gray-600 mb-4">
                <p
                  onClick={() => handleModalFollower("followers")}
                  className="cursor-pointer hover:underline"
                >
                  {userInfoData?.data?.followers?.length || 0} Followers
                </p>
                <p
                  onClick={() => handleModalFollower("following")}
                  className="cursor-pointer hover:underline"
                >
                  {userInfoData?.data?.following?.length || 0} Following
                </p>
                <ModalFollower
                  isOpen={isOpen}
                  onClose={onClose}
                  data={
                    typeModalFollow === "followers"
                      ? userInfoData?.data?.followers
                      : userInfoData?.data?.following
                  }
                  userAuth={userAuth}
                  title={
                    typeModalFollow === "followers" ? "Followers" : "Following"
                  }
                  type={
                    typeModalFollow === "followers" ? "followers" : "following"
                  }
                />
              </div>
              {userAuth && userAuth?._id !== userInfoData?.data?._id && (
                <FollowButton user={userAuth} id={userInfoData.data._id} />
              )}
            </div>
            <div className="border-b border-gray-300 pb-4 mt-4">
              <h5 className="mb-4 text-gray-700 font-bold text-base">
                Documents
              </h5>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center border border-gray-300 rounded-lg w-10 h-10">
                    <FileIcon height="18px" />
                  </div>
                  <div>
                    <h6 className="text-base font-semibold text-gray-700">
                      Resume.pdf
                    </h6>
                    <p className="text-[15px] text-gray-600">1.25 MB</p>
                  </div>
                </div>
                <Button variant="unstyled">
                  <DownloadIcon />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="mb-4 text-gray-700 font-bold text-base">
                Contacts
              </h5>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Email
                </p>
                <span className="break-words text-gray-600 text-[15px] overflow-hidden">
                  {userInfoData?.data?.email}
                </span>
              </div>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Phone Number
                </p>
                <span className="break-words text-gray-600 text-[15px]">
                  {userInfoData?.data?.mobile}
                </span>
              </div>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Location
                </p>
                <span className="break-words text-gray-600 text-[15px]">
                  {userInfoData?.data?.address}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 border border-gray-300 rounded-lg p-6 h-fit">
            <Tabs position="relative" variant="unstyled" defaultIndex={0}>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Feeds</Tab>
                {userAuth && userAuth._id === userInfoData?.data?._id && (
                  <>
                    <Tab>Saved Posts</Tab>
                    <Tab>Settings</Tab>
                    <Tab>Change Password</Tab>
                  </>
                )}
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="green.500"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel paddingTop="24px" paddingBottom="24px">
                  <h5 className="text-lg text-gray-700 mb-2 font-bold">
                    About
                  </h5>
                  <p className="mt-6 mb-4 text-gray-600 text-base">
                    {userInfoData?.data?.introduction}
                  </p>

                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      Education
                    </h5>
                    <div className="candidate-content relative mt-4 flex gap-7">
                      <WrapItem>
                        <Avatar
                          name="B"
                          src=""
                          size="sm"
                          backgroundColor="rgba(2,175,116,.15)"
                          color="#02af74"
                        />
                      </WrapItem>
                      <div>
                        <h6 className="text-base text-gray-700 mb-1 font-semibold">
                          BCA - Bachelor of Computer Applications
                        </h6>
                        <p className="text-[15px] text-gray-600 mb-2">
                          International University - (2004 - 2010)
                        </p>
                        <p className="text-[15px] text-gray-600 mb-4">
                          There are many variations of passages of available,
                          but the majority alteration in some form. As a highly
                          skilled and successfull product development and design
                          specialist with more than 4 Years of My experience.
                        </p>
                      </div>
                    </div>
                    <div className="candidate-content relative mt-4 flex gap-7">
                      <WrapItem>
                        <Avatar
                          name="B"
                          src=""
                          size="sm"
                          backgroundColor="rgba(2,175,116,.15)"
                          color="#02af74"
                        />
                      </WrapItem>
                      <div>
                        <h6 className="text-base text-gray-700 mb-1 font-semibold">
                          BCA - Bachelor of Computer Applications
                        </h6>
                        <p className="text-[15px] text-gray-600 mb-2">
                          International University - (2004 - 2010)
                        </p>
                        <p className="text-[15px] text-gray-600 mb-4">
                          There are many variations of passages of available,
                          but the majority alteration in some form. As a highly
                          skilled and successfull product development and design
                          specialist with more than 4 Years of My experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      Experiences
                    </h5>
                    <div className="candidate-content relative mt-4 flex gap-7">
                      <WrapItem>
                        <Avatar
                          name="B"
                          src=""
                          size="sm"
                          backgroundColor="rgba(2,175,116,.15)"
                          color="#02af74"
                        />
                      </WrapItem>
                      <div>
                        <h6 className="text-base text-gray-700 mb-1 font-semibold">
                          BCA - Bachelor of Computer Applications
                        </h6>
                        <p className="text-[15px] text-gray-600 mb-2">
                          International University - (2004 - 2010)
                        </p>
                        <p className="text-[15px] text-gray-600 mb-4">
                          There are many variations of passages of available,
                          but the majority alteration in some form. As a highly
                          skilled and successfull product development and design
                          specialist with more than 4 Years of My experience.
                        </p>
                      </div>
                    </div>
                    <div className="candidate-content relative mt-4 flex gap-7">
                      <WrapItem>
                        <Avatar
                          name="B"
                          src=""
                          size="sm"
                          backgroundColor="rgba(2,175,116,.15)"
                          color="#02af74"
                        />
                      </WrapItem>
                      <div>
                        <h6 className="text-base text-gray-700 mb-1 font-semibold">
                          BCA - Bachelor of Computer Applications
                        </h6>
                        <p className="text-[15px] text-gray-600 mb-2">
                          International University - (2004 - 2010)
                        </p>
                        <p className="text-[15px] text-gray-600 mb-4">
                          There are many variations of passages of available,
                          but the majority alteration in some form. As a highly
                          skilled and successfull product development and design
                          specialist with more than 4 Years of My experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      Skill
                    </h5>
                    <div className="flex items-center gap-1">
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        Cloud Management
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        Responsive Design
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        Network Architecture
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        PHP
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        Bootstrap
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(31,134,239,.15)"
                        color="#1f86ef"
                        className="mt-2"
                      >
                        UI & UX Designer
                      </CustomBadge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-lg text-gray-700 mb-2 font-bold">
                      Spoken languages
                    </h5>
                    <div className="flex items-center gap-1">
                      <CustomBadge
                        bgColor="rgba(4,133,101,.15)"
                        color="#048565"
                        className="mt-2"
                      >
                        English
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(4,133,101,.15)"
                        color="#048565"
                        className="mt-2"
                      >
                        German
                      </CustomBadge>
                      <CustomBadge
                        bgColor="rgba(4,133,101,.15)"
                        color="#048565"
                        className="mt-2"
                      >
                        French
                      </CustomBadge>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <NewsFeed isPostDetails userId={userData?._id || ""} />
                </TabPanel>
                <TabPanel>
                  <div className="flex flex-col gap-6">
                    {loadingSavedPosts ? (
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
                      savedPosts?.map((post: PostData) => (
                        <PostCard
                          key={post?._id}
                          post={post}
                          userAuth={userAuth!}
                        />
                      ))
                    )}
                    {savedPosts?.length === 0 && !loadingSavedPosts && (
                      <div className="flex items-center justify-center">
                        <p className="text-center text-gray-800">
                          No posts yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <form
                    className="mt-4"
                    onSubmit={handleSubmit(handleUpdateUserInfo)}
                  >
                    <div className="mt-4">
                      <h5 className="text-lg text-gray-700 mb-2 font-bold">
                        My Account
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
                          {errorAvatar && (
                            <ErrorMessage message={errorAvatar} />
                          )}
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
                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="mobile"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Attachments CV
                        </label>
                        <input
                          type="file"
                          onChange={(event: any) => {
                            handleFileUpload(event);
                          }}
                        />
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
                            htmlFor="languages"
                            className="text-[15px] mb-2 inline-block"
                          >
                            Languages
                          </label>
                          <Input
                            type="text"
                            id="languages"
                            defaultValue={"languages"}
                            placeholder="Enter your languages"
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
                            {...register("languages")}
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
                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        colorScheme={"green"}
                        isLoading={isLoading}
                      >
                        Update
                      </Button>
                    </div>
                  </form>
                </TabPanel>
                <TabPanel>
                  <form
                    className="mt-4"
                    onSubmit={handleSubmitPassword(handleChangePassword)}
                  >
                    <div className="mt-4">
                      <h5 className="text-lg text-gray-700 mb-2 font-bold">
                        Change Password
                      </h5>
                      <div className="mb-4">
                        <label
                          htmlFor="introduce"
                          className="text-[15px] mb-2 inline-block"
                        >
                          Current password
                        </label>

                        <Input
                          type="password"
                          placeholder="Enter password"
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
                          {...registerPassword("currentPassword")}
                        />

                        {errorsPassword.currentPassword && (
                          <ErrorMessage
                            message={errorsPassword.currentPassword.message}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label
                            htmlFor="introduce"
                            className="text-[15px] mb-2 inline-block"
                          >
                            New password
                          </label>

                          <Input
                            type="password"
                            placeholder="Enter password"
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
                            {...registerPassword("newPassword")}
                          />

                          {errorsPassword.newPassword && (
                            <ErrorMessage
                              message={errorsPassword.newPassword.message}
                            />
                          )}
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="introduce"
                            className="text-[15px] mb-2 inline-block"
                          >
                            Confirm password
                          </label>

                          <Input
                            type="password"
                            placeholder="Enter password"
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
                            {...registerPassword("confirmPassword")}
                          />

                          {errorsPassword.confirmPassword && (
                            <ErrorMessage
                              message={errorsPassword.confirmPassword.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        colorScheme={"green"}
                        isLoading={loadingAuth}
                      >
                        Update
                      </Button>
                    </div>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(Profile);
