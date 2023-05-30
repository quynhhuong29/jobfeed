export interface AuthState {
  isLoggedIn: boolean;
  data: {
    access_token: string;
    user: any;
  };
  isLoading: boolean;
  err: string;
}

export interface ApiErrorResponse {
  message: string;
}
