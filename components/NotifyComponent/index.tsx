import { isReadNotify } from "@/redux/apis/notifyAPI";
import { isReadNotifyAction } from "@/redux/reducers/notifyReducers";
import { useAppDispatch } from "@/redux/store";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { DotIcon } from "../icons";

interface Props {
  notify: any;
}

const NotifyComponent = ({ notify }: Props) => {
  const dispatch = useAppDispatch();
  const handleIsRead = async (msg: any) => {
    if (!msg?._id) return;

    dispatch(isReadNotifyAction(msg._id));
    try {
      await isReadNotify(msg._id);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Link
      href={notify?.url ? notify?.url : ""}
      onClick={() => handleIsRead(notify)}
      className="bg-white flex flex-col gap-3 px-3 py-2 cursor-pointer hover:bg-gray-300"
    >
      <div className="flex items-center gap-2">
        <Avatar size="md" name="Avatar" src={notify?.user?.avatar || ""} />
        <div className="flex flex-col">
          <p className="font-semibold text-gray-900">{`${
            notify?.user?.fullName ? notify?.user?.fullName : ""
          } ${
            notify?.user?.firstName || notify?.user?.lastName
              ? notify?.user?.firstName + " " + notify?.user?.lastName
              : ""
          } ${notify?.text}`}</p>
          {notify?.content && <small>{notify?.content.slice(0, 20)}...</small>}
        </div>
      </div>
      <p className="text-xs text-gray-600 flex items-center justify-between">
        {moment(notify?.createdAt).fromNow()}
        {!notify?.isRead && (
          <DotIcon fill="#007bff" width="20px" height="20px " />
        )}
      </p>
    </Link>
  );
};

export default NotifyComponent;
