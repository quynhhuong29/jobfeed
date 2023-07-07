import api from "@/configs/axios";

async function createJob({
  job_title,
  job_description,
  job_requirement,
  industry,
  working_location,
  address,
  employment_type,
  expiring_date,
  benefit,
  experience,
  level,
  image,
  logo,
  salary,
  contact_name,
  contact_address,
  contact_email,
  contact_phone,
  company_id,
  idUser,
}: any): Promise<any> {
  try {
    const response = await api.post(`jobPost/createJob`, {
      job_title,
      job_description,
      job_requirement,
      industry,
      working_location,
      address,
      employment_type,
      expiring_date,
      benefit,
      experience,
      level,
      image,
      logo,
      salary,
      contact_name,
      contact_address,
      contact_email,
      contact_phone,
      company_id,
      idUser,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.msg); // Throw an error with the response data
    } else {
      throw error; // Throw the original error if there is no response
    }
  }
}

async function getInfoJob(id: string): Promise<any> {
  return (await api.get(`/jobPost/getJob/${id}`)).data;
}

async function getJobsByCompany(id: string): Promise<any> {
  return (await api.get(`/jobPost/getJobsByCompany/${id}`)).data;
}

async function deleteJob(id: string): Promise<any> {
  return (await api.delete(`/jobPost/deleteJob/${id}`)).data;
}

async function updateJob({
  id,
  benefit,
  job_description,
  job_requirement,
  job_title,
  expiring_date,
  contact_name,
  contact_phone,
  contact_address,
  contact_email,
  experience,
  industry,
  working_location,
  address,
  employment_type,
  level,
  salary,
}: any): Promise<any> {
  return (
    await api.post(`/jobPost/updateJobPost`, {
      id,
      benefit,
      job_description,
      job_requirement,
      job_title,
      expiring_date,
      contact_name,
      contact_phone,
      contact_address,
      contact_email,
      experience,
      industry,
      working_location,
      address,
      employment_type,
      level,
      salary,
    })
  ).data;
}

async function searchJobs(
  search?: string,
  working_location?: string,
  industry?: string
): Promise<any> {
  const response = await api.get(`/jobPost/searchJobPost`, {
    params: {
      search,
      workingLocation: working_location,
      industry,
    },
  });
  return response.data;
}

async function getJobsLatest(): Promise<any> {
  return (await api.get("/jobPost/latest")).data;
}

async function countJobsByIndustry(): Promise<any> {
  return (await api.get("/jobPost/countJobsByIndustry")).data;
}

export {
  createJob,
  getInfoJob,
  getJobsByCompany,
  deleteJob,
  updateJob,
  searchJobs,
  getJobsLatest,
  countJobsByIndustry,
};
