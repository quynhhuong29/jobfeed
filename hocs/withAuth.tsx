import { selectIsLoggedIn } from "@/redux/reducers/authReducers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getItem, setLocalStorageContent } from "@/utils/localStorage.util";
import { refreshToken } from "@/redux/apis/authAPI";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useSelector(selectIsLoggedIn);

    const access_token = getItem("access_token");

    useEffect(() => {
      if (!isAuthenticated) {
        // refreshToken()
        //   .then((res) => {
        //     setLocalStorageContent("access_token", res.access_token);
        //     setLocalStorageContent("isAuthenticated", "true");
        //     router.push("/");
        //   })
        //   .catch((err) => {
        //     setLocalStorageContent("isAuthenticated", "false");
        //   });
        router.push("/login");
      }
    }, [isAuthenticated, router, access_token]);

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
