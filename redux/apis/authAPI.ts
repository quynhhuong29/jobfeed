import api from "@/configs/axios";

async function login(email: string, password: string): Promise<any> {
  return (await api.post("/login", { email, password })).data;
}

async function signup(
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<any> {
  return (
    await api.post("/register", {
      email,
      username,
      password,
      firstName,
      lastName,
      role: "candidate",
    })
  ).data;
}

async function activeEmail(token: string): Promise<any> {
  return (await api.post(`/active_email`, { verifiedToken: token })).data;
}

async function refreshToken(): Promise<any> {
  return (await api.post(`/refresh_token`)).data;
}

async function logout(): Promise<any> {
  return (await api.post(`/logout`)).data;
}

async function changePassword({
  current_password,
  new_password,
  cf_password,
}: any): Promise<any> {
  return (
    await api.post("/change-password", {
      current_password,
      new_password,
      cf_password,
    })
  ).data;
}

export { login, signup, activeEmail, refreshToken, logout, changePassword };
