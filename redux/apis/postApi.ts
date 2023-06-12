import api from "@/configs/axios";

async function createPost(content: string, images: any): Promise<any> {
  return (await api.post("/post", { content, images })).data;
}

async function getPosts(): Promise<any> {
  return (await api.get("/posts")).data;
}

export { createPost, getPosts };
