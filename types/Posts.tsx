import { Comment } from "./Comment";
import { User } from "./User";
export interface Post {
  _id: string;
  content: string;
  images: any[];
}

export interface PostData {
  content: string;
  images: Image[];
  comments: Comment[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  likes: string[];
}

export interface Image {
  url: string;
  public_id: string;
}
