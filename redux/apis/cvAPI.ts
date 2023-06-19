import api from "@/configs/axios";

async function createCV({
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
  return (
    await api.post(`/createResume`, {
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
    })
  ).data;
}

export { createCV };
