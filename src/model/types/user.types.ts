interface ProfileType {
  isAdult: boolean;
  username: string;
  profilePic: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  _id: string;
  email: string;
  Admin: boolean;
  Block: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  defaultProfile: string;
  profiles: ProfileType[];
}
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  sessionLimit: number;
  duration: number;
  isActive: boolean;
  features: string[] ;
}
