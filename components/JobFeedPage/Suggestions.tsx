import { suggestionUsers } from "@/redux/apis/userAPI";
import {
  getUsersSuggestionAsync,
  selectSuggestionUsers,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { User } from "@/types/User";
import { RepeatIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserCard from "../UserCard";

const Suggestions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userAuth, setUserAuth] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);

  let userLocal: string | null = "";
  if (typeof window !== "undefined") {
    userLocal = localStorage.getItem("user");
  }

  useEffect(() => {
    if (!userLocal) return;
    setUserAuth(JSON.parse(userLocal));
  }, [userLocal]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await suggestionUsers();
      setUsers(res?.users);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed">
      <div className="flex gap-2 items-center">
        <h5>Suggestions for you</h5>
        <IconButton
          icon={<RepeatIcon />}
          aria-label="Reload"
          onClick={fetchData}
          variant="unstyled"
          isLoading={isLoading}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "#eff0f2",
            },
          }}
        />
      </div>
      {users?.map((user: User) => (
        <UserCard user={user} key={user._id} userAuth={userAuth} />
      ))}
    </div>
  );
};

export default Suggestions;
