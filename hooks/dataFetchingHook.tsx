import api from "@/configs/axios";
import { useEffect, useState } from "react";

export function useDataFetching(apiUrl: string) {
  const [totalPages, setTotalPages] = useState(50);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const page = Math.min(currentPage + 1, totalPages);
      const result = await api.get(`${apiUrl}?page=${page}&limit=${8}`);
      setPages(result.data?.jobs);
      setTotalPages(Math.ceil(result.data?.total / 8) || 50);
      setLoading(false);
    };
    fetchData();
  }, [apiUrl, currentPage, totalPages]);
  return {
    loading,
    pages,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
