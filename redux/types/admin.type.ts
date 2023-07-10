import { PostData } from "@/types/Posts";
import { User } from "@/types/User";

export interface AdUser {
  data: User[];
  isLoading: boolean;
  error: string;
}
export interface AdPost {
  data: PostData[];
  isLoading: boolean;
  error: string;
}

export interface AdminState {
  users: AdUser;
  posts: AdPost;
}

export interface DeleteUser {
  _id: string;
  role: string;
}
