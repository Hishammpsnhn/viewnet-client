export interface UserPlan {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: "active" | "queued" | "inactive";
  sessionLimit: number;
  ads: boolean;
  live: boolean;
  uhd: boolean;
  createdAt: string;
  updatedAt: string;
}
