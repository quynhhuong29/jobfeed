import api from "@/configs/axios";

async function createPost(content: string, images: any): Promise<any> {
  return (await api.post("/post", { content, images })).data;
}

export { createPost };
