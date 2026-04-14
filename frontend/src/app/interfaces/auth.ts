export interface AuthResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}
