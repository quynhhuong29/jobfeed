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
  return (
    await api.post(`jobPost/createJob`, {
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
    })
  ).data;
}

async function getInfoJob(id: string): Promise<any> {
  return (await api.get(`/jobPost/getJob/${id}`)).data;
}

export { createJob, getInfoJob };
