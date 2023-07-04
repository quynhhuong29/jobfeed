/* eslint-disable @next/next/no-img-element */
import FooterAlt from "@/components/FooterAlt";
import {
  FacebookIcon,
  LinkedInIcon,
  MessengerIcon,
  TwitterIcon,
} from "@/components/icons";
import HomeIcon from "@/components/icons/HomeIcon";
import NewsFeed from "@/components/JobFeedPage/NewsFeed";
import { useDebounce } from "@/hooks/debounceHook";
import { getPosts } from "@/redux/apis/postApi";
import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import { getNotifiesAsync } from "@/redux/reducers/notifyReducers";
import { getPostsAsync } from "@/redux/reducers/postReducers";
import {
  getUsersSuggestionAsync,
  searchUserAsync,
  selectSearchUser,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
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

function JobFeed() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const searchUserData = useSelector(selectSearchUser);
  const isAuthenticated = useSelector(selectIsLoggedIn);

  const modalRef = useRef<any>(null);

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(getPostsAsync());
    // dispatch(getNotifiesAsync());
  }, [dispatch, isAuthenticated]);

  return (
    <LayoutMain>
      <section className="w-full border-b border-gray-200 bg-white shadow-[0_3px_10px_0_rgba(49,64,71,.08)] py-4 sticky top-[60px] left-0 right-0 z-10">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between">
          <div className="relative mx-auto">
            <InputGroup w={"300px"}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="search"
                placeholder="Enter to Search..."
                value={searchValue}
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
                        <span className="text-xs">{`${ele?.firstName.trim()} ${ele?.lastName.trim()}`}</span>
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
              onClick={() => router.push("/message")}
            >
              <MessengerIcon />
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full bg-white relative py-4 min-h-[100vh]">
        <NewsFeed />
      </section>
    </LayoutMain>
  );
}

export default JobFeed;
