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

export { createComment };
