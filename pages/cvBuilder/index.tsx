import CV1 from "@/components/CVBuilder/CV";
import FooterAlt from "@/components/FooterAlt";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function CVBuilder() {
  const router = useRouter();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    if (auth && auth?.role !== "candidate") {
      router.push("/");
    }
  }, [auth, router]);
  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">CV Builder</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <CV1 />
          <Button
            colorScheme={"green"}
            mt={4}
            float={"right"}
            onClick={() => {
              router.push("/cvBuilder/1");
            }}
          >
            Use Template
          </Button>
        </div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(CVBuilder);
