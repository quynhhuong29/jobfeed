import { activeEmail } from "@/redux/apis/authAPI";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SuccessIcon } from "@/components/icons";

const Verify = () => {
  const router = useRouter();
  const { verifiedToken } = router?.query;
  console.log(verifiedToken);

  useEffect(() => {
    async function verifyEmail(token: string) {
      const response = await activeEmail(token);
      console.log(response);
    }
    if (verifiedToken) {
      verifyEmail(verifiedToken as string);
    }
  }, [verifiedToken]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-green-100">
      <Card align="center">
        <CardHeader>
          <Heading size="md">Congratulation!</Heading>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center mb-4">
            <SuccessIcon w={100} h={100} />
          </div>

          <Text>Your account has been successfully created.</Text>
        </CardBody>
        <CardFooter>
          <Button colorScheme="green">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Verify;
