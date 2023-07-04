/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import JobCard from "@/components/JobCard";
import { useDebounce } from "@/hooks/debounceHook";
import {
  getUserInfoByIdAsync,
  searchUserAsync,
  selectSearchUser,
  selectUserInfo,
} from "@/redux/reducers/userReducers";
import { useAppDispatch } from "@/redux/store";
import { DownloadIcon } from "@chakra-ui/icons";
import { Avatar, Button, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LayoutMain from "../../components/layout/LayoutMain";
import withAuth from "@/hocs/withAuth";
import {
  getInfoCompanyAsync,
  selectCompany,
} from "@/redux/reducers/companyReducers";
import { getJobsByCompanyAsync, selectJob } from "@/redux/reducers/jobReducers";

function companyDetails() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;

  const company = useSelector(selectCompany);
  const job = useSelector(selectJob);

  useEffect(() => {
    if (!id) return;

    dispatch(getJobsByCompanyAsync(id.toString()));
    dispatch(getInfoCompanyAsync(id.toString()));
  }, [id, dispatch]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Company Details</h3>
          </div>
        </div>
      </section>
      <section className="w-full bg-white relative py-20">
        <div className="md:max-w-[1140px] mx-auto grid grid-cols-3 gap-5">
          <div className="border border-gray-300 rounded-lg p-6 h-fit">
            <div className="flex flex-col items-center justify-center border-b border-gray-300 pb-4">
              <div className="border border-gray-300 bg-white rounded-full p-1">
                <WrapItem>
                  <Avatar
                    size="lg"
                    name={company?.infoCompany?.companyName}
                    src={company?.infoCompany?.logo}
                  />
                </WrapItem>
              </div>

              <h5 className="mt-6 text-gray-700 font-semibold text-lg capitalize">
                {company?.infoCompany?.companyName}
              </h5>
            </div>
            <div className="mt-4">
              <h5 className="mb-4 text-gray-700 font-bold text-base">
                Profile Overview
              </h5>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Website
                </p>
                <span className="break-words text-gray-600 text-[15px] overflow-hidden">
                  {company?.infoCompany?.website}
                </span>
              </div>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Employees
                </p>
                <span className="break-words text-gray-600 text-[15px]">
                  {company?.infoCompany?.size}
                </span>
              </div>
              <div className="flex items-center py-2">
                <p className="min-w-[120px] text-gray-700 text-[15px] font-medium">
                  Address
                </p>
                <span className="break-words text-gray-600 text-[15px]">
                  {company?.infoCompany?.address}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 border border-gray-300 rounded-lg p-6 h-fit">
            <h5 className="text-lg text-gray-700 mb-2 font-bold">
              About Company
            </h5>
            <p className="mt-6 mb-4 text-gray-600 text-base">
              {company?.infoCompany?.info}
            </p>

            <div className="mt-4">
              <h5 className="text-lg text-gray-700 mb-2 font-bold">
                Current Opening
              </h5>
              <div className="flex flex-col gap-3">
                {job?.listJobCompany?.map((ele: any) => (
                  <JobCard key={ele?._id} data={ele} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutMain>
  );
}

export default companyDetails;
