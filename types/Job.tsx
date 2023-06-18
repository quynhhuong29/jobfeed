export interface JobInfo {
  address: string;
  benefit: string;
  company_info: any;
  contact_address: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  createdAt: string;
  employment_type: string;
  expiring_date: string;
  idUser: string;
  image: string[];
  industry: {
    _id: string;
    title: string;
    description: string;
  };
  job_description: string;
  job_requirement: string;
  job_title: string;
  level: string;
  salary: { money_type: string; min: string; max: string };
  updatedAt: string;
  working_experience: { isRequired: boolean; from: string; to: string };
  from: string;
  isRequired: boolean;
  to: string;
  working_location: string;
  _id: string;
}
