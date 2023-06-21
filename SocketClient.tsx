import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "@/redux/reducers/socketReducers";
import withAuth from "./hocs/withAuth";

function SocketClient() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://localhost:5001");

    dispatch(setSocket(socket));

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return null;
}

export default withAuth(SocketClient);
