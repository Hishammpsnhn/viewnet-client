import { useEffect, useState } from "react";
import { UserPlan } from "../../model/types/plan.types";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { GETUserPlanDetails_API } from "../../api/userApi";
import PlanDetails from "../../components/subscription/PlanDetails";
import LoadingSpinner from "../../components/LoadingSpinner";

const MyPlanPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [myPlans, setMyPlans] = useState<UserPlan[]>([]);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const fetchPlans = async () => {
      if (user && user.user) {
        try {
          setLoading(true);
          const data = await GETUserPlanDetails_API(user.user._id);
          if (data && data.success) {
            setMyPlans(data.userPlan);
          }
        } catch (error) {
          console.error("Error fetching user plans:", error);
        }finally{
          setLoading(false);
        }
      }
    };

    fetchPlans();
  }, [user]);
  return (
    <div className="grid grid-cols-1 gap-4 m-5 ">
      <h1 className="text-2xl font-bold text-white">Subscription History</h1>
      {myPlans.length === 0 && !loading && (
        <p className="text-white text-lg">No subscriptions found.</p>
      )}
      {loading && (
        <LoadingSpinner/>
      )}
      {myPlans.map((plan) => (
        <PlanDetails planData={plan} key={plan.id} />
      ))}
    </div>
  );
};

export default MyPlanPage;
