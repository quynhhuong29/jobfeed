import { IconProps, Icon } from "@chakra-ui/react";

const MailIcon = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Complete">
          <g id="mail">
            <g>
              <polyline
                fill="none"
                points="4 8.2 12 14.1 20 8.2"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polyline>
              <rect
                fill="none"
                height="14"
                rx="2"
                ry="2"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="18"
                x="3"
                y="6.5"
              ></rect>
            </g>
          </g>
        </g>
      </g>
    </Icon>
  );
};

export default MailIcon;
