import api from "@/configs/axios";

async function getInfoCompany(id: string): Promise<any> {
  return (await api.get(`/getInfoCompany/${id}`)).data;
}

export { getInfoCompany };
