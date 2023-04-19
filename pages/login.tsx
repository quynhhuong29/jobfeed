import ErrorMessage from "@/components/ErrorMessage";
import { LayoutAuthentication } from "@/components/layout";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { User } from "@/types/Authentication";
import { login } from "@/redux/apis/authAPI";
import { setLocalStorageContent } from "@/utils/localStorage.util";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface ILogin {}

const schema = yup
  .object({
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const Login = ({}: ILogin) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const handleLogin = async (data: User) => {
    setIsLoading(true);
    try {
      if (data.email && data.password) {
        const response = await login(data.email, data.password);

        if (response) {
          setLocalStorageContent("token", response.access_token);
          router.push("/");
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response.data) toast.error("Your email/password is incorrect");
      else toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <LayoutAuthentication image="/assets/images/sign-in.png">
      <div className="w-full flex items-center flex-col justify-center">
        <div className="text-center mb-4">
          <h5 className="text-white font-bold text-lg">Welcome Back !</h5>
          <p className="text-white text-base">Sign in to continue to Jobvia.</p>
        </div>
        <form className="mb-4" onSubmit={handleSubmit(handleLogin)}>
          <div className="mb-4 text-white">
            <label htmlFor="email" className="text-[15px] mb-2 inline-block">
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="off"
              _placeholder={{ opacity: 0.4, color: "#fff" }}
              sx={{
                backgroundColor: "rgba(255,255,255,.1)",
                border: "none",
                color: "#fff",
                padding: "10px",
                fontSize: "14px",
                fontWeight: "500",
                "&:focus-visible": {
                  outline: "0",
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "none",
                  boxShadow: "none",
                },
                "&:hover": {
                  border: "none",
                },
              }}
              {...register("email")}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="password" className="text-[15px] mb-2 inline-block">
              Password
            </label>

            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                _placeholder={{ opacity: 0.4, color: "#fff" }}
                sx={{
                  backgroundColor: "rgba(255,255,255,.1)",
                  border: "none",
                  color: "#fff",
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: "500",
                  "&:focus-visible": {
                    outline: "0",
                    backgroundColor: "rgba(255,255,255,.1)",
                    border: "none",
                    boxShadow: "none",
                  },
                  "&:hover": {
                    border: "none",
                  },
                }}
                {...register("password")}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.45rem"
                  size="sm"
                  onClick={handleClick}
                  className="text-black"
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
          </div>
          <div className="mb-6 text-white flex">
            <Link href="" className="text-sm ml-auto">
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            w={"100%"}
            padding={"10px 20px"}
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-center text-white">
          <p className="mb-0">
            Don&lsquo;t have an account?{" "}
            <Link
              className="fw-medium text-white text-decoration-underline"
              href="/signup"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </LayoutAuthentication>
  );
};

export default Login;
