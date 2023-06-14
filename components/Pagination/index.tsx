import { IconButton } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { ArrowDoubleLeftIcon, ArrowDoubleRightIcon } from "../icons";
import styles from "./styles.module.scss";

interface Props {
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ setCurrentPage, currentPage, totalPages }: Props) => {
  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
  };
  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage !== 0;
  return (
    <ReactPaginate
      breakLabel={<span className="mx-2">...</span>}
      nextLabel={
        showNextButton && (
          <IconButton
            aria-label="Search database"
            icon={
              <ArrowDoubleRightIcon width="10px" height="10px" fill="#74788d" />
            }
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #e2e5e8",
              margin: "0 4px",
            }}
          />
        )
      }
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      previousLabel={
        showPrevButton && (
          <IconButton
            aria-label="Search database"
            icon={
              <ArrowDoubleLeftIcon width="10px" height="10px" fill="#74788d" />
            }
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid #e2e5e8",
              margin: "0 4px",
            }}
          />
        )
      }
      containerClassName="flex items-center justify-center mt-6"
      renderOnZeroPageCount={null}
      pageClassName="block border border-solid border-gray-400 text-gray-600 flex items-center justify-center rounded-full w-10 h-10 mx-1 hover:text-gray-600 hover:bg-gray-200"
      activeClassName="bg-green-200 text-white"
    />
  );
};

export default Pagination;
