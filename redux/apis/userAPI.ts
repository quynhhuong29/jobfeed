import api from "../../configs/axios";

async function searchUser(value: string): Promise<any> {
  return (await api.get("/search", { params: { username: value } })).data;
}

async function getUserInfoById(id: string): Promise<any> {
  return (await api.get(`/user/${id}`)).data;
}

async function updateInfoUser(userInfo: any): Promise<any> {
  return (await api.patch(`/user`, userInfo)).data;
}

export { searchUser, getUserInfoById, updateInfoUser };
