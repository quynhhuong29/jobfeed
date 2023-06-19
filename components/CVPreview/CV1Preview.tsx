/* eslint-disable @next/next/no-img-element */
import { createCVAsync, selectCV } from "@/redux/reducers/cvReducers";
import { useAppDispatch } from "@/redux/store";
import { Button } from "@chakra-ui/react";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CV1Preview({ dataResume }: { dataResume?: any }) {
  const dispatch = useAppDispatch();
  const cv = useSelector(selectCV);
  const pdfRef = useRef<any>();

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!dataResume) return;
    try {
      await dispatch(createCVAsync(dataResume)).unwrap();
      toast.success("Create CV Successful");
    } catch (err: any) {
      if (err.response?.data) toast.error(err.response?.data?.message);
      else toast.error("Something went wrong. Please try again.");
    }
  };

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("CV.pdf");
    });
    // const pdfHeight = 297;
    // html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
    //   // Add { scrollY: -window.scrollY } to capture the full page content
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", "a4", true);
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();
    //   const imgWidth = canvas.width;
    //   const imgHeight = canvas.height;
    //   const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    //   const imgX = (pdfWidth - imgWidth * ratio) / 2;
    //   const imgY = 0;
    //   pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, pdfHeight);
    //   pdf.save("CV.pdf");
    // });
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="rounded-md flex flex-col min-w-[560px]" ref={pdfRef}>
        <div className="h-[30px] w-full bg-[#6faa8a] rounded-t-md">&nbsp;</div>
        <div className="p-6">
          <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-6">
            <h1 className="text-[#6faa8a] text-3xl font-semibold">
              {dataResume?.firstName &&
                dataResume?.lastName &&
                `${dataResume?.firstName} ${dataResume?.lastName}`}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-[#F2F2F2] flex flex-col">
              <div className="mb-6">
                <img
                  src={dataResume?.avatar ? dataResume?.avatar : ""}
                  alt=""
                  className="w-full max-h-[254px]"
                />
              </div>
              <div className="flex flex-col">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-3">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Personal details
                  </h2>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">Name</h3>
                  <p className="text-sm text-[#1F130F]">
                    {dataResume?.firstName &&
                      dataResume?.lastName &&
                      `${dataResume.firstName} ${dataResume.lastName}`}
                  </p>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">
                    Email address
                  </h3>
                  <p className="text-sm text-[#1F130F]">
                    {dataResume?.email && dataResume?.email}
                  </p>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">
                    Phone number
                  </h3>
                  <p className="text-sm text-[#1F130F]">
                    {dataResume?.phone && dataResume?.phone}
                  </p>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">
                    Address
                  </h3>
                  <p className="text-sm text-[#1F130F]">
                    {dataResume?.address &&
                      dataResume?.city &&
                      dataResume?.country &&
                      `${dataResume?.address}, ${dataResume?.city}, ${dataResume?.country}`}
                  </p>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">
                    LinkedIn
                  </h3>
                  <p className="text-sm text-[#1F130F]">
                    {dataResume?.linkedin && dataResume?.linkedin}
                  </p>
                </div>
                <div className="flex flex-col mb-2">
                  <h3 className="text-sm text-[#1F130F] font-semibold">
                    Portfolio
                  </h3>
                  <p className="text-sm text-[#1F130F]">arthurbates.com</p>
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-3">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Skills
                  </h2>
                </div>
                {dataResume?.skill &&
                  (Array.isArray(dataResume?.skill)
                    ? dataResume?.skill
                    : [dataResume?.skill]
                  )?.map((ele: any, index: number) => (
                    <div className="flex items-center gap-2 mb-2" key={index}>
                      <div className="w-2 min-w-[8px] h-2 bg-[#6faa8a]">
                        &nbsp;
                      </div>
                      <p className="text-sm text-[#1F130F]">
                        {ele.skill}: {ele.description}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col mt-5">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-6">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Languages
                  </h2>
                </div>
                {dataResume?.language &&
                  (Array.isArray(dataResume?.language)
                    ? dataResume?.language
                    : [dataResume?.language]
                  )?.map((ele: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm text-[#1F130F] font-semibold">
                          {ele?.language}
                        </h3>
                        <p className="text-sm text-[#6faa8a] mb-2">
                          {ele?.level}
                        </p>
                      </div>
                      <p className="text-sm text-[#1F130F]">
                        {ele?.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-span-2 ml-3">
              <div className="flex flex-col">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-3">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Profile
                  </h2>
                </div>
                <p className="text-sm text-[#1F130F]">
                  {dataResume?.overview && dataResume?.overview}
                </p>
              </div>
              <div className="flex flex-col mt-5">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-6">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Experience
                  </h2>
                </div>
                {dataResume?.workExperience &&
                  (Array.isArray(dataResume?.workExperience)
                    ? dataResume?.workExperience
                    : [dataResume?.workExperience]
                  )?.map((ele: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <div className="flex justify-between">
                        <h3 className="text-sm text-[#1F130F] font-semibold">
                          {ele?.position}
                        </h3>
                        <p className="text-[#6faa8a] font-medium text-sm">
                          {new Date(ele?.startDate).toDateString()} -{" "}
                          {ele?.endDate === "Present"
                            ? "Present"
                            : new Date(ele?.endDate).toDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-[#6faa8a] mb-2">
                        {ele?.company}
                      </p>
                      <div className="flex items-center gap-2 mb-1 ml-2">
                        <div className="w-1 min-w-1 h-1 rounded-full bg-[#1F130F]">
                          &nbsp;
                        </div>
                        <p className="text-sm text-[#1F130F]">
                          {ele?.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col mt-5">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-6">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Education
                  </h2>
                </div>
                {dataResume?.education &&
                  (Array.isArray(dataResume?.education)
                    ? dataResume?.education
                    : [dataResume?.education]
                  )?.map((ele: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <div className="flex justify-between">
                        <h3 className="text-sm text-[#1F130F] font-semibold">
                          {ele?.school}
                        </h3>
                        <p className="text-[#6faa8a] font-medium text-sm">
                          {new Date(ele?.startDate).toDateString()} -{" "}
                          {ele?.endDate === "Present"
                            ? "Present"
                            : new Date(ele?.endDate).toDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-[#1F130F]">
                        {ele?.description}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col">
                <div className="pb-2 border-b border-[rgb(226, 226, 226)] mb-3">
                  <h2 className="text-[#6faa8a] text-2xl font-semibold">
                    Hobbies
                  </h2>
                </div>
                <p className="text-sm text-[#1F130F]">{dataResume?.hobbies}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[30px] w-full bg-[#6faa8a] mt-auto rounded-b-md">
          &nbsp;
        </div>
      </div>
      <Button
        type="submit"
        colorScheme={"green"}
        isLoading={cv?.isLoading}
        ml="auto"
      >
        Submit
      </Button>
      <Button colorScheme={"purple"} ml="auto" onClick={downloadPDF}>
        Download PDF
      </Button>
    </form>
  );
}

export default CV1Preview;
