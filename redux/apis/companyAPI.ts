import api from "@/configs/axios";

async function getInfoCompany(id: string): Promise<any> {
  return (await api.get(`/getInfoCompany/${id}`)).data;
}

async function updateInfoCompany(data: any): Promise<any> {
  try {
    const response = await api.put(`/updateInfoCompany`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { getInfoCompany, updateInfoCompany };
