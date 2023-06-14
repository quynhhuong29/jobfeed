import { PostData } from "@/types/Posts";

export interface PostState {
  posts: PostData[];
  isLoading: boolean;
  error: string;
}
