import api from "@/configs/axios";
import { DeleteUser } from "../types/admin.type";

async function deleteUser(data: DeleteUser): Promise<any> {
  return (
    await api.post(`/delete`, {
      _id: data._id,
      role: data.role,
    })
  ).data;
}

async function getAllUser(): Promise<any> {
  return (await api.get(`/users`)).data;
}

async function updateInfoUser(userInfo: any): Promise<any> {
  return (await api.patch(`/updateUserInfo`, userInfo)).data;
}

async function getAllPosts(): Promise<any> {
  return (await api.get(`/getAllPosts`)).data;
}

async function deletePost(id: string): Promise<any> {
  return (await api.delete(`/delete/${id}`)).data;
}

export { deleteUser, getAllUser, updateInfoUser, getAllPosts, deletePost };
