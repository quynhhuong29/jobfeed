import api from "@/configs/axios";

async function createPost(content: string, images: any): Promise<any> {
  return (await api.post("/post", { content, images })).data;
}

async function getPosts(): Promise<any> {
  return (await api.get("/posts")).data;
}

async function updatePost(
  _id: string,
  content: string,
  images: any
): Promise<any> {
  return (await api.patch(`/post/${_id}`, { content, images })).data;
}

async function deletePost(_id: string): Promise<any> {
  return (await api.delete(`/post/${_id}`)).data;
}

async function likePost(_id: string): Promise<any> {
  return (await api.patch(`/post/${_id}/like`)).data;
}

async function unLikePost(_id: string): Promise<any> {
  return (await api.patch(`/post/${_id}/unlike`)).data;
}

async function savePost(_id: string): Promise<any> {
  return (await api.patch(`/savePost/${_id}`)).data;
}

async function unSavePost(_id: string): Promise<any> {
  return (await api.patch(`/unSavePost/${_id}`)).data;
}

export {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  unLikePost,
  savePost,
  unSavePost,
};
