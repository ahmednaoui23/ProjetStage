export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  password?: string;
  datecreation: string;
  imageUrl?: string;
}
