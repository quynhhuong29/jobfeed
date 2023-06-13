/* eslint-disable @next/next/no-img-element */
const ImageShow = ({ src }: any) => {
  return (
    <img
      src={src}
      className="w-full h-full relative object-contain max-h-[100px] p-1 bg-white rounded-lg"
      alt="images"
    />
  );
};

export default ImageShow;
