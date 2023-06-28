import api from "@/configs/axios";

async function createNotify({
  id,
  recipients,
  url,
  text,
  content,
  image,
}: any): Promise<any> {
  return (
    await api.post("/notify", { id, recipients, url, text, content, image })
  ).data;
}

async function getNotifies(): Promise<any> {
  return (await api.get("/notifies")).data;
}

async function deleteAllNotifies(): Promise<any> {
  return (await api.delete("/deleteAllNotify")).data;
}

async function removeNotify(id: string, url: string): Promise<any> {
  return (await api.delete(`/notify/${id}?url=${url}`)).data;
}

async function isReadNotify(id: string): Promise<any> {
  return (await api.patch(`/isReadNotify/${id}`)).data;
}

export {
  createNotify,
  getNotifies,
  deleteAllNotifies,
  isReadNotify,
  removeNotify,
};
