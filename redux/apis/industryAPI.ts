import api from "@/configs/axios";

async function getAllIndustry(): Promise<any> {
  return (await api.get(`/getIndustry`)).data;
}

export { getAllIndustry };
