import api from "@/configs/axios";

async function uploadResumeFile(file: any): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return (await api.post(`/updateResume`, formData)).data;
}

async function downloadFile(): Promise<any> {
  return (await api.get(`/getFileResume`)).data;
}

export { uploadResumeFile, downloadFile };
