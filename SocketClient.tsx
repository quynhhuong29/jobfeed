import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectSocket, setSocket } from "@/redux/reducers/socketReducers";
import withAuth from "./hocs/withAuth";
import { selectAuth } from "./redux/reducers/authReducers";
import { updatePostAction } from "./redux/reducers/postReducers";
import { PostData } from "./types/Posts";
import { useAppDispatch } from "./redux/store";

function SocketClient() {
  const dispatch = useAppDispatch();

  const socket = useSelector(selectSocket);
  const auth = useSelector(selectAuth)?.data;

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      // Wait for the next tick to dispatch the action
      setTimeout(() => {
        dispatch(setSocket(socket));
      }, 0);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.close();
    };
  }, [dispatch]);

  // joinUser
  useEffect(() => {
    if (socket && socket.emit) {
      socket.emit("joinUser", auth?.user);
    }
  }, [socket, auth?.user]);

  useEffect(() => {
    if (socket && socket.on) {
      socket.on("likeToClient", (newPost: PostData) => {
        dispatch(updatePostAction(newPost));
      });
    }

    return () => {
      if (socket && socket.off) {
        socket.off("likeToClient");
      }
    };
  }, [socket, auth.user, dispatch]);

  useEffect(() => {
    if (socket && socket.on) {
      socket.on("unLikeToClient", (newPost: PostData) => {
        dispatch(updatePostAction(newPost));
      });
    }

    return () => {
      if (socket && socket.off) {
        socket.off("unLikeToClient");
      }
    };
  }, [socket, dispatch]);

  return null;
}

export default withAuth(SocketClient);
