import api from "@/configs/axios";

async function getMessagesApi( id: string, page = 1): Promise<any> {
  return (await api.get(`/message/${id}?limit=${page * 9}`, {  })).data;
}

async function messageApi( msg : any): Promise<any> {
  return (await api.post(`/message`, msg)).data;
}

async function getConversationsApi( page = 1): Promise<any> {
  return (await api.get(`conversations?limit=${page * 9}`)).data;
}

export {
    getMessagesApi,
    messageApi,
    getConversationsApi
}