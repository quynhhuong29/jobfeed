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

async function followUser(id: string, userInfo: any): Promise<any> {
  return (await api.patch(`/user/${id}/follow`, userInfo)).data;
}

async function unFollowUser(id: string, userInfo: any): Promise<any> {
  return (await api.patch(`/user/${id}/unFollow`, userInfo)).data;
}

async function followJob(id: string): Promise<any> {
  return (await api.patch(`/user/${id}/followJob`)).data;
}

async function suggestionUsers(): Promise<any> {
  return (await api.get("/suggestionsUser")).data;
}

async function savedJob(id: string): Promise<any> {
  return (await api.get(`/user/${id}/followJob`)).data;
}

export {
  searchUser,
  getUserInfoById,
  updateInfoUser,
  followUser,
  unFollowUser,
  suggestionUsers,
  savedJob,
};
