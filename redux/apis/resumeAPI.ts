import api from "@/configs/axios";

async function uploadResumeFile(file: any): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return (await api.post(`/updateResume`, formData)).data;
}

async function downloadFile(): Promise<any> {
  return (await api.get(`/getFileResume`)).data;
}

async function getListResumes(): Promise<any> {
  return (await api.get("/getListResume")).data;
}

async function deleteResume(id: string): Promise<any> {
  return (await api.patch(`/deleteCV`, { id })).data;
}

async function updateResume({
  id,
  avatar,
  firstName,
  lastName,
  email,
  dateOfBirth,
  position,
  phoneNumber,
  address,
  descriptionProfile,
  educations,
  experiences,
  skill,
  language,
}: any): Promise<any> {
  return (
    await api.patch(`/updateCV`, {
      id,
      avatar,
      firstName,
      lastName,
      email,
      dateOfBirth,
      position,
      phoneNumber,
      address,
      descriptionProfile,
      educations,
      experiences,
      skill,
      language,
    })
  );
}
export {
  uploadResumeFile,
  downloadFile,
  getListResumes,
  deleteResume,
  updateResume,
};
