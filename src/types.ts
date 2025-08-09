export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}


export interface Enquiry {
  id: number;
  title: string;
  duration: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  number_of_persons: number;
  created_at: string;
}