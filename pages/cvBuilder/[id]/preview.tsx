import FooterAlt from "@/components/FooterAlt";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import { LayoutMain } from "@/components/layout";
import withAuth from "@/hocs/withAuth";
import { selectAuth } from "@/redux/reducers/authReducers";
import {
  AddIcon,
  ChevronRightIcon,
  EditIcon,
  MinusIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { createCVAsync, selectCV } from "@/redux/reducers/cvReducers";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/store";
import CV1Preview from "@/components/CVPreview/CV1Preview";

type FormValues = {
  profileTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  DOB: string;
  country: string;
  languages: any;
  email: string;
  city: string;
  address: string;
  overview: string;
  workExperience: any;
  skill: any;
  education: any;
  hobbies: string;
  linkIn: string;
};

function CVBuilder() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const { state } = router.query;
  const parsedState = state ? JSON.parse(state as string) : null;
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
            <h3 className="text-2xl font-medium">CV Builder Information</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <div className="flex flex-col gap-4">
            <CV1Preview dataResume={parsedState} />
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh]  bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto"></div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(CVBuilder);
