import { User } from "./User";
export interface Post {
  _id: string;
  content: string;
  images: Image[];
}

export interface PostData {
  content: string;
  images: Image[];
  comments: string[];
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
