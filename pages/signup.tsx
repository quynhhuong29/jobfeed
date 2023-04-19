import { LayoutAuthentication } from "@/components/layout";
import { User } from "@/types/Authentication";
import {
  Button,
  Checkbox,
  extendTheme,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";
import { signup } from "@/redux/apis/authAPI";
import { toast } from "react-toastify";

interface ISignUp {}

const theme = extendTheme({
  components: {
    Input: {
      baseStyle: {
        field: {
          bg: "rgba(255,255,255,.1)",
        },
      },
    },
  },
});

const schema = yup
  .object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last name is required"),
    // dob: yup
    //   .string()
    //   .required("Date of Birth is required")
    //   .matches(
    //     /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
    //     "Date of Birth must be a valid date in the format YYYY-MM-DD"
    //   ),
    username: yup.string().required("Username is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    // confirmPassword: yup
    //   .string()
    //   .oneOf([yup.ref("password"), ""], "Passwords must match")
    //   .required("Confirm Password is required"),
    terms: yup.bool().oneOf([true], "Accept terms and conditions"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const SignUp = ({}: ISignUp) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleSignUp = async (data: User) => {
    setIsLoading(true);
    try {
      if (data.firstName && data.lastName && data.username) {
        await signup(
          data.email,
          data.username,
          data.password,
          data.firstName,
          data.lastName
        );
        onOpen();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.data) toast.error(err.response?.data?.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <LayoutAuthentication image="/assets/images/sign-up.png">
        <div className="w-full flex items-center flex-col justify-center">
          <div className="text-center mb-4">
            <h5 className="text-white font-bold text-lg">
              Let&lsquo;s Get Started!
            </h5>
            <p className="text-white text-[15px] text-center">
              Sign Up and get access to all the features of Jobvia
            </p>
          </div>
          <form className="mb-4 w-full" onSubmit={handleSubmit(handleSignUp)}>
            <div className="mb-4 text-white">
              <label
                htmlFor="firstName"
                className="text-[15px] mb-2 inline-block"
              >
                FirstName
              </label>
              <Input
                type="text"
                id="firstName"
                placeholder="Enter your firstName"
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
                {...register("firstName")}
              />
              {errors.firstName && (
                <ErrorMessage message={errors.firstName.message} />
              )}
            </div>
            <div className="mb-4 text-white">
              <label
                htmlFor="lastName"
                className="text-[15px] mb-2 inline-block"
              >
                LastName
              </label>
              <Input
                type="text"
                id="lastName"
                placeholder="Enter your lastName"
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
                {...register("lastName")}
              />
              {errors.lastName && (
                <ErrorMessage message={errors.lastName.message} />
              )}
            </div>
            <div className="mb-4 text-white">
              <label
                htmlFor="username"
                className="text-[15px] mb-2 inline-block"
              >
                Username
              </label>
              <Input
                type="text"
                id="username"
                placeholder="Enter your username"
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
                {...register("username")}
              />
              {errors.username && (
                <ErrorMessage message={errors.username.message} />
              )}
            </div>
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
              <label
                htmlFor="password"
                className="text-[15px] mb-2 inline-block"
              >
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

            <div className="mb-6 text-white">
              <Checkbox colorScheme="green" {...register("terms")}>
                I agree to the{" "}
                <Link href="/" className="underline">
                  Terms and conditions
                </Link>
              </Checkbox>
              {errors.terms && <ErrorMessage message={errors.terms.message} />}
            </div>
            <Button
              type="submit"
              w={"100%"}
              padding={"10px 20px"}
              isLoading={isLoading}
            >
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-white">
            <p className="mb-0">
              Already a member?{" "}
              <Link
                className="fw-medium text-white text-decoration-underline"
                href="/login"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </LayoutAuthentication>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Successful!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please check your email to activate your account.
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button colorScheme="green">
              <Link href="/login">Go to login page</Link>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUp;
