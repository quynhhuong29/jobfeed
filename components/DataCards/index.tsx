import { ReactNode } from "react";

export interface DataCardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
}
function DataCard({ icon, title, subtitle }: DataCardProps) {
  return (
    <div className="cursor-pointer inline-flex flex-col gap-6 justify-center items-center py-10 px-6 transition-all duration-500 ease-in-out hover:-translate-y-2.5">
      <div className="bg-green-100 w-16 h-16 rounded-lg inline-flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center">
        <h5 className="text-lg font-semibold mb-2 text-gray-700">{title}</h5>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>
    </div>
  );
}

export default DataCard;
