import api from "@/configs/axios";

async function login(email: string, password: string): Promise<any> {
  return (await api.post("/login", { email, password })).data;
}

export { login };
