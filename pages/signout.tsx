import { LayoutAuthentication } from "@/components/layout";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

const Signout = () => {
  return (
    <LayoutAuthentication image="/assets/images/sign-in.png">
      <div className="w-full flex items-center flex-col justify-center">
        <div className="text-center mb-4">
          <h5 className="text-white font-bold text-lg">You are Logged Out</h5>
          <p className="text-white text-base">Thank you for using Jobvia</p>
        </div>
        <Button type="button" w={"100%"} padding={"10px 20px"}>
          <Link href="/login">Sign In</Link>
        </Button>
        <div className="mt-6 text-center text-white">
          <p className="mb-0">
            Don&lsquo;t have an account?{" "}
            <Link className="fw-medium text-white underline" href="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </LayoutAuthentication>
  );
};

export default Signout;
