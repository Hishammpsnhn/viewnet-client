export interface ProfileType {
  isAdult: boolean;
  username: string;
  profilePic: string;
  _id: string;
}

export interface UserType {
  _id: string;
  email: string;
  isAdmin: boolean;
  isBlock: boolean;
  createdAt: string;
  updatedAt: string;
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
  live:boolean,
  uhd:boolean,
  ads:boolean,
}


//respose api

interface UserPlan {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  sessionLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserPlanDetailsResponse {
  message: boolean;
  userPlan: UserPlan;
}
export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  sessionLimit: number;
  createdAt: string;
  updatedAt: string;
}