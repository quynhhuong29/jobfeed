import { followUser, unFollowUser } from "@/redux/apis/userAPI";
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
}

const FollowButton = ({ user, id }: Props) => {
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
    if (
      userInfoData &&
      id &&
      userInfoData?.followers?.find((item: string) => item === user._id)
    ) {
      setFollowed(true);
    }
    return () => setFollowed(false);
  }, [userInfoData, id, user]);

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
