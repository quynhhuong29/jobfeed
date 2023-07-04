import React from "react";
// import { imageShow, videoShow } from '../../utils/mediaShow'
import { useSelector, useDispatch } from "react-redux";
import Times from "./Time";
import { selectAuth } from "@/redux/reducers/authReducers";
import Avatar from "../Avatar";
import { imageShow } from "@/utils/mediaShow";
import VideoShow from "../MediaShow/VideoShow";
import { deleteMessageAsync } from "@/redux/reducers/messageReducers";
import { useAppDispatch } from "@/redux/store";

interface MsgProps {
  user?: any;
  msg?: any;
  theme?: boolean;
  data?: any;
}

const MsgDisplay = ({ user, msg, theme, data }: MsgProps) => {
  const auth = useSelector(selectAuth)?.data;
  const dispatch = useAppDispatch();

  const handleDeleteMessages = () => {
    if (!data) return;

    if (window.confirm("Do you want to delete?")) {
      dispatch(deleteMessageAsync({ msg, data }));
    }
  };

  return (
    <>
      <div className="chat_title">
        <Avatar src={user.avatar} size="small-avatar" />
        <span>
          {user.role === "company"
            ? user?.firstName
            : user.firstName + " " + user.lastName + " "}
          {user.role === "company" && (
            <i className="ml-1 fas fa-check-circle text-[#007BFF]"></i>
          )}
        </span>
      </div>

      <div className="you_content">
        {user._id === auth.user._id && (
          <i
            className="fas fa-trash text-[#dc3545]"
            onClick={handleDeleteMessages}
          />
        )}

        <div>
          {msg.text && (
            <div
              className="chat_text"
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            >
              {msg.text}
            </div>
          )}
          {msg.media.map((item: any, index: number) => (
            <div key={index}>
              {item.url.match(/video/i)
                ? VideoShow(item.url)
                : imageShow(item.url)}
            </div>
          ))}
        </div>

        {msg.call && (
          <button
            className="btn flex items-center p-2"
            style={{ background: "#eee", borderRadius: "10px" }}
          >
            <span
              className="material-icons font-bold mr-1"
              style={{
                fontSize: "2.5rem",
                color: msg.call.times === 0 ? "crimson" : "green",
                filter: theme ? "invert(1)" : "invert(0)",
              }}
            >
              {msg.call.times === 0
                ? msg.call.video
                  ? "videocam_off"
                  : "phone_disabled"
                : msg.call.video
                ? "video_camera_front"
                : "call"}
            </span>

            <div className="text-left">
              <h6>{msg.call.video ? "Video Call" : "Audio Call"}</h6>
              <small>
                {msg.call.times > 0 ? (
                  <Times total={msg.call.times} />
                ) : (
                  new Date(msg.createdAt).toLocaleTimeString()
                )}
              </small>
            </div>
          </button>
        )}
      </div>

      <div className="chat_time">
        {new Date(msg.createdAt).toLocaleString()}
      </div>
    </>
  );
};

export default MsgDisplay;
