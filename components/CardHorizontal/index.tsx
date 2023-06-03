import { ArrowRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
import CustomBadge from "../CustomBadge";
import { MapPinIcon, StarIcon } from "../icons";
import styles from "./CardHorizontal.module.scss";

export interface ICardHorizontal {
  data: any;
}

const CardHorizontal = ({ data }: ICardHorizontal) => {
  return (
    <div
      className={`w-full relative mt-6 border-gray-300 bg-white rounded-lg min-h-[42px] ${styles.card_container}`}
    >
      <div className="absolute z-[2] translate-x-[10px] translate-y-2 rotate-[36deg]">
        <StarIcon width={"22px"} height={"22px"} fill="#fff" />
      </div>
      <div className="flex p-6 items-center justify-evenly">
        <div className="rounded-lg w-[16%]">
          <Image
            src={data?.logo}
            width="55"
            height="55"
            alt="logo"
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col w-[25%]">
          <h5 className="text-gray-800">{data?.positionApply}</h5>
          <p className="text-sm text-gray-600">{data?.company}</p>
        </div>
        <div className="flex items-center gap-1 w-[25%]">
          <MapPinIcon height="22px" width="16px" />
          <p className="text-[16px] text-gray-600">{data?.location}</p>
        </div>
        <p className="text-[16px] text-gray-600 w-[16%]">
          <span className="text-green-200">$</span>
          {data?.salary}
        </p>
        <div className="w-[16%]">
          {data?.keys?.map((key: string, index: number) => {
            if (key === "fulltime") {
              return (
                <CustomBadge colorScheme="green" className="mt-1" key={index}>
                  Full Time
                </CustomBadge>
              );
            }
            if (key === "private")
              return (
                <CustomBadge colorScheme="cyan" className="mt-1" key={index}>
                  Private
                </CustomBadge>
              );
            if (key === "partTime")
              return (
                <CustomBadge colorScheme="pink" className="mt-1" key={index}>
                  Part Time
                </CustomBadge>
              );
            if (key === "urgent")
              return (
                <CustomBadge colorScheme="red" className="mt-1" key={index}>
                  Urgent
                </CustomBadge>
              );
            if (key === "freelancer")
              return (
                <CustomBadge colorScheme="purple" className="mt-1" key={index}>
                  Freelancer
                </CustomBadge>
              );
          })}
        </div>
      </div>
      <div className="flex p-4 items-center justify-between bg-gray-200 text-[15px] text-gray-800 rounded-b-lg">
        <p>
          Experience: <span className="text-gray-600">{data.experience}</span>
        </p>
        {data.note && (
          <p>
            Note: <span className="text-gray-600">{data.note}</span>
          </p>
        )}
        <Button
          rightIcon={<ArrowRightIcon w={2} h={2} />}
          variant="link"
          sx={{ fontSize: "15px", color: "#314047" }}
          size="xs"
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default CardHorizontal;
