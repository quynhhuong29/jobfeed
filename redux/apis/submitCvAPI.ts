import api from "@/configs/axios";

async function submitCV({
  idJob,
  idCompany,
  idCV,
  dataCV,
  dateSubmit,
  resumeFile,
}: any): Promise<any> {
  let request;
  if (!resumeFile) {
    request = {
      idJob,
      idCompany,
      idCV,
      dataCV,
      dateSubmit,
    };
  } else {
    request = {
      idJob,
      idCompany,
      idCV,
      dateSubmit,
      resumeFile,
    };
  }
  return (await api.post(`/submitCV`, request)).data;
}

export { submitCV };
