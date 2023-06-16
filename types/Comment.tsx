import { User } from "./User";

export interface Comment {
  content: string;
  createdAt: string;
  likes: any[];
  postId: string;
  postUserId: string;
  updatedAt: string;
  user: User;
  _id: string;
  reply: any;
}
