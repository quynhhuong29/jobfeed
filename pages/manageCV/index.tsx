/* eslint-disable react-hooks/rules-of-hooks */
import { LayoutMain } from "@/components/layout";
import ResumeCard from "@/components/ResumeCard";
import withAuth from "@/hocs/withAuth";
import {
  getListResumesAsync,
  selectResumes,
} from "@/redux/reducers/resumeReducers";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const manageCV = () => {
  const dispatch = useAppDispatch();

  const resume = useSelector(selectResumes);

  useEffect(() => {
    // if (resume?.data.length > 0) return;

    dispatch(getListResumesAsync());
  }, [dispatch, resume?.data.length]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Manage CV Online</h3>
          </div>
        </div>
      </section>
      <section className="w-full min-h-[100vh] bg-white py-10">
        <div className="md:max-w-[1164px] mx-auto shadow-md p-6 border border-gray-500 rounded-md">
          {Array.isArray(resume?.data) &&
            resume?.data?.map((ele, index) => (
              <ResumeCard data={ele} index={index} key={index} />
            ))}
        </div>
      </section>
    </LayoutMain>
  );
};
export default withAuth(manageCV);
