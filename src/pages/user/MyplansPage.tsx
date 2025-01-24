import React, { useEffect, useState } from "react";
import { UserPlan } from "../../model/types/plan.types";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { GETUserPlanDetails_API } from "../../api/user/userApi";
import PlanDetails from "../../components/subscription/PlanDetails";

const MyPlanPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [myPlans, setMyPlans] = useState<UserPlan[]>([]);
  useEffect(() => {
    const fetchPlans = async () => {
      if (user && user.user) {
        try {
          const data = await GETUserPlanDetails_API(user.user._id);
          console.log(data);

          if (data && data.success) {
            setMyPlans(data.userPlan);
          }
        } catch (error) {
          console.error("Error fetching user plans:", error);
        }
      }
    };

    fetchPlans();
  }, [user]);
  return (
    <div className="grid grid-cols-1 gap-4 m-5 ">
      <h1 className="text-2xl font-bold text-white">Subscription History</h1>
      {myPlans.map((plan) => (
        <PlanDetails planData={plan} key={plan.id} />
      ))}
    </div>
  );
};

export default MyPlanPage;
