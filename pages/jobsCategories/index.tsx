/* eslint-disable react-hooks/rules-of-hooks */
import CategoryCard from "@/components/CategoryCard";
import { LayoutMain } from "@/components/layout";
import {
  countJobsIndustryAsync,
  selectCountsJobIndustry,
} from "@/redux/reducers/jobReducers";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const jobsCategories = () => {
  const dispatch = useAppDispatch();
  const countJobsIndustry = useSelector(selectCountsJobIndustry);

  useEffect(() => {
    dispatch(countJobsIndustryAsync());
  }, [dispatch]);

  return (
    <LayoutMain>
      <section className="w-full bg-[url('/assets/images/page-title.png')] bg-cover bg-[#029663] bg-center border-radius-custom relative pt-14 pb-16">
        <div className="md:max-w-[1140px] mx-auto flex items-center justify-between text-white">
          <div className="mx-auto pr-20">
            <h3 className="text-2xl font-medium">Jobs Categories</h3>
          </div>
        </div>
      </section>
      <section className="md:max-w-[1140px] mx-auto min-h-[100vh] bg-white pt-20">
        <div className="grid grid-cols-3 gap-6">
          <div className="w-full bg-gray-200 p-6 gap-[14px] flex flex-col rounded-lg">
            {countJobsIndustry?.slice(0, 8)?.map((item, index) => (
              <CategoryCard
                value={item.count}
                name={item?.industry_info?.title}
                key={index}
                id={item?.industry_info?._id}
              />
            ))}
          </div>
          <div className="w-full bg-gray-200 p-6 gap-[14px] flex flex-col rounded-lg">
            {countJobsIndustry?.slice(8, 12)?.map((item, index) => (
              <CategoryCard
                value={item.count}
                name={item?.industry_info?.title}
                key={index}
                id={item?.industry_info?._id}
              />
            ))}
          </div>
          <div className="w-full bg-gray-200 p-6 gap-[14px] flex flex-col rounded-lg">
            {countJobsIndustry?.slice(12, 18)?.map((item, index) => (
              <CategoryCard
                value={item.count}
                name={item?.industry_info?.title}
                key={index}
                id={item?.industry_info?._id}
              />
            ))}
          </div>
        </div>
      </section>
    </LayoutMain>
  );
};

export default jobsCategories;
