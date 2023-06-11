import "@/styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "@/redux/store";
import { useEffect } from "react";
import { getItem, setLocalStorageContent } from "@/utils/localStorage.util";
import { refreshToken } from "@/redux/apis/authAPI";
import jwt_decode from "jwt-decode";

export default function App({ Component, pageProps }: AppProps) {
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
    if (isTokenExpired()) {
      getRefreshToken();
    }
  }, []);

  return (
    <Provider store={store}>
      <ChakraProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          enableMultiContainer
          icon
        />
      </ChakraProvider>
    </Provider>
  );
}
