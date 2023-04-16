import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface ILayoutAuthentication {
  children: React.ReactNode;
  image: string;
}
//flex lg:flex-row flex-col justify-center
const LayoutAuthentication = ({ children, image }: ILayoutAuthentication) => {
  return (
    <div
      className={`bg-[#02af741a] flex items-center justify-center h-screen ${inter.className}`}
    >
      <div className="grid grid-flow-col lg:columns-12 xl:columns-10 rounded-md shadow-xl md:mt-14">
        <div className="p-6 flex flex-col items-center bg-white rounded-l-md w-full h-full">
          <div className="max-w-[106px] max-h-[22px]">
            <img src="/assets/images/logo-dark.png" alt="logo" />
          </div>
          <div className="mt-5 max-w-[422px] h-full flex items-center justify-center">
            <img src={image} alt="sign-in" />
          </div>
        </div>
        <div className="bg-green-400 p-12 h-auto flex items-center justify-center rounded-r-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutAuthentication;
