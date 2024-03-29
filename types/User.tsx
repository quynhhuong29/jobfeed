export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  role: "candidate" | "company";
  gender: "Male" | "Female";
  mobile: string;
  address: string;
  introduction: string;
  website: string;
  followers: string[];
  following: string[];
  followCompany: string[];
  followJob: string[];
  followersCompany: string[];
  saved: string[];
  isCompany: string;
}
