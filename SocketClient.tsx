import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectSocket, setSocket } from "@/redux/reducers/socketReducers";
import withAuth from "./hocs/withAuth";
import { selectAuth } from "./redux/reducers/authReducers";
import { updatePostAction } from "./redux/reducers/postReducers";
import { PostData } from "./types/Posts";
import { useAppDispatch } from "./redux/store";
import { setCall } from "./redux/reducers/callReducers";
import { setPeer } from "./redux/reducers/peerReducers";
import { selectOnline, setOffline, setOnline } from "./redux/reducers/onlineReducers";
import { addMessage, addUser } from "./redux/reducers/messageReducers";


function SocketClient() {
  const dispatch = useAppDispatch();

  const socket = useSelector(selectSocket);
  const auth = useSelector(selectAuth)?.data;
  const online = useSelector(selectOnline);

  // setup peer
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const Peer = require("peerjs").default

      const peer = new Peer("", {
        path: "/",
        secure: true
      })
      dispatch(setPeer(peer))
    }

  },[dispatch])

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      // Wait for the next tick to dispatch the action
      setTimeout(() => {
        dispatch(setSocket(socket));
      }, 1000);
    });

    return () => {
      socket.close();
    };
  }, [dispatch]);

  // joinUser
  useEffect(() => {
    if (socket && socket.emit && auth?.user) {
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

  // Check User Online / Offline
  useEffect(() => {
    console.log("checkUserOnline", auth.user);
    if(socket && socket.emit)
      socket.emit('checkUserOnline', auth.user)
  },[socket, auth.user])

  useEffect(() => {
    if(socket && socket.on)
      socket.on('checkUserOnlineToMe', (data : any) =>{
          console.log("checkUserOnlineToMe", data);
          data.forEach((item : any) => {
              if(!online.includes(item.id)){
                  dispatch(setOnline(item.id))
              }
          })
      })

      return () => socket?.off && socket.off('checkUserOnlineToMe')
  },[socket, dispatch, online])

  useEffect(() => {
    if(socket && socket.on)
      socket.on('checkUserOnlineToClient', (id : string) =>{
          if(!online.includes(id)){
              dispatch(setOnline(id))
          }
      })

      return () =>socket?.off && socket.off('checkUserOnlineToClient')
  },[socket, dispatch, online])

  // Check User Offline
  useEffect(() => {
    if(socket && socket.on)
      socket.on('CheckUserOffline', (id : string) =>{
          dispatch(setOffline(id))
      })

      return () => socket && socket.off && socket.off('CheckUserOffline')
  },[socket, dispatch])

  // Call User
  useEffect(() => {
    if (socket && socket.off) {
      socket.on('callUserToClient', (data: any) => {
        dispatch(setCall(data))
      })
    }

    return () => socket?.off('callUserToClient')
}, [socket, dispatch])

  // Message
  useEffect(() => {
    if(socket && socket.on)
      socket.on('addMessageToClient', (msg : any) =>{
          dispatch(addMessage(msg))

          dispatch(addUser({
            ...msg.user, 
            text: msg.text, 
            media: msg.media
        }))
      })

    return () => socket?.off && socket.off('addMessageToClient')
  },[socket, dispatch])

  return null;
}

export default withAuth(SocketClient);
