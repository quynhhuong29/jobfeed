import { followUser, unFollowUser } from "@/redux/apis/userAPI";
import { getPostsAsync } from "@/redux/reducers/postReducers";
import {
  getUserInfoByIdAsync,
  selectUserInfo,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { User } from "@/types/User";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  user: User;
  id: string;
  type?: "followers" | "following";
}

const FollowButton = ({ user, id, type = "followers" }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfoData = useSelector(selectUserInfo)?.data;

  const handleFollow = async () => {
    if (user && id && router.query.id) {
      setLoading(true);
      try {
        await followUser(id, user);

        dispatch(getUserInfoByIdAsync(router.query.id.toString()));
        setFollowed(true);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      if (user && id) {
        setLoading(true);
        try {
          await followUser(id, user);
          setFollowed(true);

          setLoading(false);
          await dispatch(getPostsAsync());
        } catch (err) {
          setLoading(false);
        }
      }
    }
  };

  const handleUnFollow = async () => {
    if (user && id && router.query.id) {
      setLoading(true);
      try {
        await unFollowUser(id, user);

        dispatch(getUserInfoByIdAsync(router.query.id.toString()));
        setFollowed(false);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userInfoData && id) {
      if (
        type === "followers" &&
        userInfoData?.followers?.find(
          (item: string) => item === user._id || item === id
        )
      )
        setFollowed(true);
      if (
        type === "following" &&
        userInfoData?.following?.find((item: string) => item === id)
      )
        setFollowed(true);
    }
    return () => setFollowed(false);
  }, [userInfoData, id, user, type]);

  return (
    <div>
      {followed ? (
        <Button
          variant="outline"
          colorScheme={"green"}
          onClick={handleUnFollow}
          isLoading={loading}
        >
          UnFollow
        </Button>
      ) : (
        <Button
          variant="solid"
          colorScheme={"green"}
          onClick={handleFollow}
          isLoading={loading}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowButton;
