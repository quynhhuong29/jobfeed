import { LayoutAdmin } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth?.role !== "admin") {
      setIsAdmin(false);
    }
  }, [auth?.role]);
  return (
    <LayoutAdmin>
      {isAdmin ? (
        <div>Admin</div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl font-bold">
            You are not authenticated to access this page.
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
};

export default withAuth(Admin);
