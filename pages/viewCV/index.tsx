/* eslint-disable react-hooks/rules-of-hooks */
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

function viewCV() {
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const { state } = router.query;
  const parsedState = state ? JSON.parse(state as string) : null;
  // useEffect(() => {
  //   if (auth && auth?.role !== "candidate") {
  //     router.push("/");
  //   }
  // }, [auth, router]);
  return (
    <LayoutMain>
      <section className="w-full min-h-[100vh] bg-white py-20">
        <div className="md:max-w-[1164px] mx-auto">
          <div className="flex flex-col gap-4">
            <CV1Preview dataResume={parsedState} isShowForCompany />
          </div>
        </div>
      </section>
    </LayoutMain>
  );
}

export default withAuth(viewCV);
