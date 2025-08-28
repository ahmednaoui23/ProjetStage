export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  status?: string;
  profileImage?: string;
  createdAt?: string;
  lastLogin?: string;
}
