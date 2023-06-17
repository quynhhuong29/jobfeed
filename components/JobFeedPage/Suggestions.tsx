import { suggestionUsers } from "@/redux/apis/userAPI";
import {
  getUsersSuggestionAsync,
  selectSuggestionUsers,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { User } from "@/types/User";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserCard from "../UserCard";

const Suggestions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userAuth, setUserAuth] = useState<User>();

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
      const res = await suggestionUsers();
      setUsers(res?.users);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed">
      <h5>Suggestions for you</h5>
      {users?.map((user: User) => (
        <UserCard user={user} key={user._id} userAuth={userAuth} />
      ))}
    </div>
  );
};

export default Suggestions;
