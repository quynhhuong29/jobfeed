import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import MsgDisplay from "./MsgDisplay";
import Icons from "../Icons";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils/upload.util";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/router";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  addMessageAsync,
  deleteConversationAsync,
  getMessagesAsync,
  loadMoreMessagesAsync,
  selectMessage,
} from "@/redux/reducers/messageReducers";
import { selectSocket } from "@/redux/reducers/socketReducers";
import { selectPeer } from "@/redux/reducers/peerReducers";
import { setCall } from "@/redux/reducers/callReducers";
import { toast } from "react-toastify";

const RightSide = () => {
  // const { auth, message, theme, socket, peer } = useSelector(state => state)
  const auth = useSelector(selectAuth)?.data;
  const message = useSelector(selectMessage);
  const socket = useSelector(selectSocket);
  const peer = useSelector(selectPeer);

  const dispatch = useAppDispatch();

  const { id } = useRouter().query;
  const [user, setUser] = useState<any>([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<Array<any>>([]);
  const [loadMedia, setLoadMedia] = useState(false);

  const refDisplay = useRef<null | HTMLElement>(null);
  const pageEnd = useRef<null | HTMLElement>(null);

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  const history = useRouter();

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users && message.users.length > 0) {
      setTimeout(() => {
        if (refDisplay.current)
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          } as any);
      }, 50);

      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  const handleChangeMedia = (e: any) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [] as any;

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newMedia.push(file);
    });

    // if(err) dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
    toast.error(err);
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index: number) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    setText("");
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };

    setLoadMedia(false);
    await dispatch(addMessageAsync({ msg, auth, socket }));
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        console.log("getMessagesData");
        await dispatch(getMessagesAsync({ id }));
        setTimeout(() => {
          if (refDisplay.current)
            refDisplay.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
        }, 50);
      }
    };
    getMessagesData();
  }, [id, dispatch, auth, message.data]);

  // Load More
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (pageEnd.current) observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessagesAsync({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
    // eslint-disable-next-line
  }, [isLoadMore]);

  const handleDeleteConversation = () => {
    if (window.confirm("Do you want to delete?")) {
      dispatch(deleteConversationAsync(id));
      return history.push("/message");
    }
  };

  // Call
  const caller = ({ video }: any) => {
    const { _id, avatar, username, firstName, lastName } = user as any;
    const fullName = firstName + " " + lastName;
    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      username,
      fullName,
      video,
    };
    // dispatch({ type: GLOBALTYPES.CALL, payload: msg })
    dispatch(setCall(msg));
  };

  const callUser = ({ video }: any) => {
    const { _id, avatar, username, firstName, lastName } = auth.user;
    const fullName = firstName + " " + lastName;

    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      username,
      fullName,
      video,
    } as any;
    if (peer.open) msg.peerId = peer._id;

    socket.emit("callUser", msg);
  };

  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <>
      <div
        className="message_header rounded-tr-lg"
        style={{ cursor: "pointer" }}
      >
        {user.length !== 0 && (
          <UserCard user={user}>
            <div className="flex gap-4 mr-2">
              <i
                className="fas fa-phone-alt text-[#008000] text-xl"
                onClick={handleAudioCall}
              />

              <i
                className="fas fa-video text-[#007BFF] mx-3 text-xl"
                onClick={handleVideoCall}
              />

              <i
                className="fas fa-trash text-[#DC143C] text-xl"
                onClick={handleDeleteConversation}
              />
            </div>
          </UserCard>
        )}
      </div>
      <div
        className="chat_container"
        style={{ height: media.length > 0 ? "calc(100% - 180px)" : "" }}
      >
        <div className="chat_display" ref={refDisplay as any}>
          <button
            style={{ marginTop: "-25px", opacity: 0 }}
            ref={pageEnd as any}
          >
            Load more
          </button>

          {data &&
            data.map((msg: any, index: number) => (
              <div key={index}>
                {msg.sender !== auth.user._id && (
                  <div className="chat_row other_message">
                    <MsgDisplay user={user} msg={msg} />
                  </div>
                )}

                {msg.sender === auth.user._id && (
                  <div className="chat_row you_message">
                    <MsgDisplay user={auth.user} msg={msg} data={data} />
                  </div>
                )}
              </div>
            ))}

          {loadMedia && (
            <div className="chat_row you_message">
              <img src={""} alt="loading" />
            </div>
          )}
        </div>
      </div>

      <div
        className="show_media"
        style={{ display: media.length > 0 ? "grid" : "none" }}
      >
        {media.map((item, index) => (
          <div key={index} id="file_media">
            {item.type.match(/video/i)
              ? videoShow(URL.createObjectURL(item))
              : imageShow(URL.createObjectURL(item))}
            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
          </div>
        ))}
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter you message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            filter: "invert(1)", // : 'invert(0)',
            background: "#040404",
            color: "white",
          }}
        />

        <Icons setContent={setText} content={text} />

        <div className="file_upload">
          <i className="fas fa-image text-[#dc3545]" />
          <input
            type="file"
            name="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChangeMedia}
          />
        </div>

        <button
          type="submit"
          className="material-icons"
          disabled={text || media.length > 0 ? false : true}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;
