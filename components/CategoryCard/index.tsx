import { useRouter } from "next/router";

interface IProps {
  name: string;
  value: number;
  id: string;
}
const CategoryCard = ({ name, value, id }: IProps) => {
  const router = useRouter();
  return (
    <div className="py-1 px-[14px] bg-white flex items-center justify-between">
      <p
        className="hover:underline cursor-pointer text-base text-[#282039]"
        onClick={() => {
          router.push({
            pathname: "/jobList",
            query: { industry: id },
          });
        }}
      >
        {name}
      </p>
      <span className="text-cyan text-xs py-[2px] px-2 bg-[#DFF6FD]">
        {value}
      </span>
    </div>
  );
};

export default CategoryCard;
