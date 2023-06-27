import { LayoutMain } from "@/components/layout";
import SubmittedCard from "@/components/SubmittedCard";
import {
  getSubmittedAsync,
  selectSubmitted,
} from "@/redux/reducers/submitReducers";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const submitted = useSelector(selectSubmitted);

  useEffect(() => {
    dispatch(getSubmittedAsync());
  }, [dispatch]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Manage Applied Jobs</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-10">
        <div className="md:max-w-[1164px] mx-auto shadow-md p-6 border border-gray-500 rounded-md">
          {Array.isArray(submitted?.data) &&
            submitted?.data?.map((ele, index) => (
              <SubmittedCard data={ele} key={index} />
            ))}
        </div>
      </section>
    </LayoutMain>
  );
};

export default AppliedJobs;
