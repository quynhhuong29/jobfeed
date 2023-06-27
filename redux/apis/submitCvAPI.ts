import api from "@/configs/axios";

async function submitCV({
  idJob,
  idCompany,
  idCV,
  dataCV,
  dateSubmit,
  resumeFile,
  name,
  email,
  documentFile,
}: any): Promise<any> {
  let request;
  if (!resumeFile) {
    request = {
      idJob,
      idCompany,
      idCV,
      dataCV,
      dateSubmit,
      documentFile,
    };
  } else {
    request = {
      idJob,
      idCompany,
      idCV,
      dateSubmit,
      resumeFile,
      name,
      email,
      documentFile,
    };
  }
  return (await api.post(`/submitCV`, request)).data;
}

async function getListCVByJob(id: string): Promise<any> {
  return (await api.get(`/getSubmittedForCompany/${id}`)).data;
}

async function updateStatusCV({
  idJob,
  idCV,
  status,
  idCandidate,
  resumeFile,
}: any): Promise<any> {
  try {
    const response = await api.post("/setStatus", {
      idJob,
      idCV,
      status,
      idCandidate,
      resumeFile,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

async function getSubmitted(): Promise<any> {
  return (await api.get("/getSubmitted")).data;
}

async function unSubmitted(idJob: string): Promise<any> {
  try {
    const response = await api.post("/unSubmitCV", { idJob });
    return response.data;
  } catch (error) {
    // Handle error if necessary
    throw error;
  }
}

export { submitCV, getListCVByJob, updateStatusCV, getSubmitted, unSubmitted };
