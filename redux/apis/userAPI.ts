import api from "../../configs/axios";

async function searchUser(value: string): Promise<any> {
  return (await api.get("/search", { params: { username: value } })).data;
}

async function getUserInfoById(id: string): Promise<any> {
  return (await api.get(`/user/${id}`)).data;
}

export { searchUser, getUserInfoById };
