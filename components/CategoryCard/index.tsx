interface IProps {
  name: string;
  value: number;
}
const CategoryCard = ({ name, value }: IProps) => {
  return (
    <div className="py-1 px-[14px] bg-white flex items-center justify-between">
      <p className="hover:underline cursor-pointer text-base text-[#282039]">
        {name}
      </p>
      <span className="text-cyan text-xs py-[2px] px-2 bg-[#DFF6FD]">
        {value}
      </span>
    </div>
  );
};

export default CategoryCard;
