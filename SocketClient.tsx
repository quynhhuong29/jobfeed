import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectSocket, setSocket } from "@/redux/reducers/socketReducers";
import withAuth from "./hocs/withAuth";
import {
  selectAuth,
  updateUserAuthAction,
} from "./redux/reducers/authReducers";
import { updatePostAction } from "./redux/reducers/postReducers";
import { PostData } from "./types/Posts";
import { useAppDispatch } from "./redux/store";
import { setCall } from "./redux/reducers/callReducers";
import { setPeer } from "./redux/reducers/peerReducers";
import { selectOnline, setOffline, setOnline } from "./redux/reducers/onlineReducers";
import { addMessageAsync, addUser } from "./redux/reducers/messageReducers";

import {
  createNotifyAction,
  removeNotifyAction,
  selectNotify,
} from "./redux/reducers/notifyReducers";

const spawnNotification = (
  body: any,
  icon: any,
  url: string,
  title: string
) => {
  let options = {
    body,
    icon,
  };
  let n = new Notification(title, options);

  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

function SocketClient() {
  const dispatch = useAppDispatch();

  const audioRef = useRef<any>();

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
  const notify = useSelector(selectNotify);

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

  // Like
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
          dispatch(addMessageAsync(msg))

          dispatch(addUser({
            ...msg.user, 
            text: msg.text, 
            media: msg.media
        }))
      })

    return () => socket?.off && socket.off('addMessageToClient')
  },[socket, dispatch])

  // Comment
  useEffect(() => {
    if (socket && socket.on) {
      socket.on("createCommentToClient", (newPost: PostData) => {
        dispatch(updatePostAction(newPost));
      });
    }

    return () => {
      if (socket && socket.off) {
        socket.off("createCommentToClient");
      }
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket && socket.on) {
      socket.on("deleteCommentToClient", (newPost: PostData) => {
        dispatch(updatePostAction(newPost));
      });
    }

    return () => {
      if (socket && socket.off) {
        socket.off("deleteCommentToClient");
      }
    };
  }, [socket, dispatch]);

  // Follow User
  useEffect(() => {
    socket?.on("followToClient", (newUser: any) => {
      dispatch(
        updateUserAuthAction({
          newUser,
        })
      );
    });

    return () => socket?.off("followToClient");
  }, [socket, dispatch, auth]);

  useEffect(() => {
    socket?.on("unFollowToClient", (newUser: any) => {
      dispatch(
        updateUserAuthAction({
          newUser,
        })
      );
    });

    return () => socket?.off("unFollowToClient");
  }, [socket, dispatch, auth]);

  // Notification
  useEffect(() => {
    socket?.on("createNotifyToClient", (msg: any) => {
      dispatch(createNotifyAction(msg));
      if (notify.sound) audioRef.current.play();
      spawnNotification(
        msg.user.firstName + " " + msg.user.lastName + " " + msg.text,
        msg.user.avatar,
        msg.url,
        "RankWork"
      );
    });

    return () => socket?.off("createNotifyToClient");
  }, [socket, dispatch, notify.sound]);

  useEffect(() => {
    socket?.on("removeNotifyToClient", (msg: any) => {
      dispatch(removeNotifyAction(msg));
    });

    return () => socket?.off("removeNotifyToClient");
  }, [socket, dispatch]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={"assets/audio/got-it-done-613.mp3"} type="audio/mp3" />
      </audio>
    </>
  );
}

export default withAuth(SocketClient);
