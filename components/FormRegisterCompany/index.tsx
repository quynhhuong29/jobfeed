import {
  Button,
  Checkbox,
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
import ErrorMessage from "../ErrorMessage";
import * as yup from "yup";
import { useState } from "react";
import { User } from "@/types/User";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerCompany } from "@/redux/apis/authAPI";

const schema = yup
  .object({
    companyName: yup.string().required("Company Name is required"),
    size: yup.string().required("Size is required"),
    city: yup.string().required("City is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    address: yup.string().required("Address is required"),
    info: yup.string(),
    phone: yup.string().required("Phone is required"),
    contactName: yup.string().required("Contact Name is required"),
    terms: yup.bool().oneOf([true], "Accept terms and conditions"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const FormRegisterCompany = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleClick = () => setShow(!show);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      if (data.email && data.password) {
        await registerCompany(
          data.email,
          data.companyName,
          data.password,
          data.size,
          data.city,
          data.address,
          data.info,
          data.contactName,
          data.phone
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
      <form className="w-full" onSubmit={handleSubmit(handleSignUp)}>
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
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-3 text-white">
            <label
              htmlFor="companyName"
              className="text-[15px] mb-2 inline-block"
            >
              Company Name
            </label>
            <Input
              type="text"
              id="companyName"
              placeholder="Enter your company name"
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
              {...register("companyName")}
            />
            {errors.companyName && (
              <ErrorMessage message={errors.companyName.message} />
            )}
          </div>
          <div className="mb-3 text-white">
            <label
              htmlFor="contactName"
              className="text-[15px] mb-2 inline-block"
            >
              Contact Name
            </label>
            <Input
              type="text"
              id="contactName"
              placeholder="Enter your contactName"
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
              {...register("contactName")}
            />
            {errors.contactName && (
              <ErrorMessage message={errors.contactName.message} />
            )}
          </div>
          <div className="mb-3 text-white">
            <label htmlFor="phone" className="text-[15px] mb-2 inline-block">
              Phone
            </label>
            <Input
              type="number"
              id="phone"
              placeholder="Enter your phone"
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
              {...register("phone")}
            />
            {errors.phone && <ErrorMessage message={errors.phone.message} />}
          </div>
          <div className="mb-3 text-white">
            <label htmlFor="size" className="text-[15px] mb-2 inline-block">
              Size
            </label>
            <Input
              type="text"
              id="size"
              placeholder="Enter your size"
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
              {...register("size")}
            />
            {errors.size && <ErrorMessage message={errors.size.message} />}
          </div>
          <div className="mb-3 text-white">
            <label htmlFor="address" className="text-[15px] mb-2 inline-block">
              Address
            </label>
            <Input
              type="text"
              id="address"
              placeholder="Enter your address"
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
              {...register("address")}
            />
            {errors.address && (
              <ErrorMessage message={errors.address.message} />
            )}
          </div>
          <div className="mb-3 text-white">
            <label htmlFor="city" className="text-[15px] mb-2 inline-block">
              City
            </label>
            <Input
              type="text"
              id="city"
              placeholder="Enter your city"
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
              {...register("city")}
            />
            {errors.city && <ErrorMessage message={errors.city.message} />}
          </div>
        </div>
        <div className="mb-3 text-white">
          <label htmlFor="info" className="text-[15px] mb-2 inline-block">
            Information
          </label>
          <Input
            type="text"
            id="info"
            placeholder="Enter your info"
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
            {...register("info")}
          />
          {errors.info && <ErrorMessage message={errors.info.message} />}
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

export default FormRegisterCompany;
