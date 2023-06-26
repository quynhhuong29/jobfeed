import api from "@/configs/axios";

async function uploadResumeFile(file: any): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return (await api.post(`/uploadResumeFile`, formData)).data;
}

async function downloadFile(): Promise<any> {
  return (await api.get(`/getFileResume`)).data;
}

async function getListResumes(): Promise<any> {
  return (await api.get("/getListResume")).data;
}

async function deleteResume(id: string): Promise<any> {
  return (await api.delete(`/deleteResumeById/${id}`)).data;
}

async function updateResume({
  id,
  title,
  firstName,
  lastName,
  phone,
  DOB,
  country,
  language,
  email,
  city,
  address,
  overview,
  workExperience,
  skill,
  education,
  hobbies,
  avatar,
  linkedin,
  tags,
}: any): Promise<any> {
  return await api.patch(`/updateResume`, {
    id,
    title,
    firstName,
    lastName,
    phone,
    DOB,
    country,
    language,
    email,
    city,
    address,
    overview,
    workExperience,
    skill,
    education,
    hobbies,
    avatar,
    linkedin,
    tags,
  });
}

async function getCVInfo(id: string): Promise<any> {
  return (await api.get(`/getResumeById/${id}`)).data;
}

export {
  uploadResumeFile,
  downloadFile,
  getListResumes,
  deleteResume,
  updateResume,
  getCVInfo,
};
