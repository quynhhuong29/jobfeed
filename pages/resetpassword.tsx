import ErrorMessage from "@/components/ErrorMessage";
import { LayoutAuthentication } from "@/components/layout";
import { Button, Input } from "@chakra-ui/react";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup.string().required("Email is required").email("Email is invalid"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const ResetPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    try {
      // if (data.email && data.password) {
      //   const response = await login(data.email, data.password);
      //   if (response) {
      //     setLocalStorageContent("token", response.access_token);
      //     router.push("/");
      //   }
      //   setIsLoading(false);
      // }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response.data) toast.error("Your email/password is incorrect");
      else toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <LayoutAuthentication image="/assets/images/reset-password.png">
      <div className="w-full flex items-center flex-col justify-center">
        <div className="text-center mb-6">
          <h5 className="text-white font-bold text-lg">Reset Password</h5>
          <p className="text-white text-base opacity-50">
            Reset your password with Jobvia
          </p>
        </div>
        <div className="bg-yellow-100 mb-6 px-5 py-3 rounded-lg max-w-[388px]">
          <p className="text-center text-yellow-400 text-base">
            Enter your Email and instructions will be sent to you!
          </p>
        </div>
        <form className="mb-4 w-full" onSubmit={handleSubmit(handleLogin)}>
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
          <Button
            type="submit"
            w={"100%"}
            padding={"10px 20px"}
            isLoading={isLoading}
          >
            Send Request
          </Button>
        </form>
        <div className="mt-6 text-center text-white">
          <p className="mb-0">
            <span className="opacity-50">Remembered It?</span>{" "}
            <Link className="fw-medium text-white underline" href="/login">
              Go to Login
            </Link>
          </p>
        </div>
      </div>
    </LayoutAuthentication>
  );
};

export default ResetPassword;
