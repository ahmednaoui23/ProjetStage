export interface User {
  id: number;  // not string
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  status?: string;
  profileImage?: string;
  createdAt?: string;
  lastLogin?: string;
}
