import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getItem, setLocalStorageContent } from "@/utils/localStorage.util";
import { refreshToken } from "@/redux/apis/authAPI";
import jwt_decode from "jwt-decode";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsLoggedIn);

    const access_token = getItem("access_token");

    const isTokenExpired = () => {
      const token = getItem("access_token");
      if (token) {
        const decoded: any = jwt_decode(token);
        if (decoded) {
          return decoded.exp < Date.now() / 1000;
        }
      }
      return true; // Trả về true nếu không có token
    };
    const getRefreshToken = async () => {
      try {
        const res = await refreshToken();
        setLocalStorageContent("access_token", res.access_token);
        setLocalStorageContent("isAuthenticated", "true");
      } catch (err) {
        setLocalStorageContent("isAuthenticated", "false");
      }
    };

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (isTokenExpired()) {
        getRefreshToken();
      }
    }, [isAuthenticated, router, access_token]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
