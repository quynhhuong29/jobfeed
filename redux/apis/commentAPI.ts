import api from "@/configs/axios";

async function createComment({
  postId,
  content,
  tag,
  reply,
  postUserId,
}: any): Promise<any> {
  return (
    await api.post(`/comment`, {
      postId,
      content,
      tag,
      reply,
      postUserId,
    })
  ).data;
}

async function deleteComment({ _id }: any): Promise<any> {
  return (await api.delete(`/comment/${_id}`)).data;
}

async function updateComment({ _id, content }: any): Promise<any> {
  return (await api.patch(`/comment/${_id}`, { content })).data;
}

async function likeComment(_id: string): Promise<any> {
  return (await api.patch(`/comment/${_id}/like`)).data;
}

async function unLikeComment(_id: string): Promise<any> {
  return (await api.patch(`/comment/${_id}/unlike`)).data;
}

export {
  createComment,
  deleteComment,
  updateComment,
  likeComment,
  unLikeComment,
};
