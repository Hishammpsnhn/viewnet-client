import React, { useEffect, useState } from "react";
import SubCard from "../../components/subscription/SubCard";
import SubscriptionModal from "../../features/subscription/EditSubscription"; // Assuming you have a modal component like this
import {
  CreatePlans_API,
  GetPlans_API,
  UpdatePlans_API,
} from "../../api/Sub-Plan/Plans";
import { Plan } from "../../model/types/user.types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PlansPage = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[] | []>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [validateError, setValidError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) =>  state.user);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };
  const handleEditClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };
  const hanldeClick = async (formData: Plan) => {

    setValidError(null);

    // Validation checks
    if (!formData.name || formData.name.length < 3) {
      setValidError("Please provide a valid subscription name.");
      return;
    }

    if (formData.price <= 0) {
      setValidError("Price must be greater than 0.");
      return;
    }

    if (formData.sessionLimit <= 0) {
      setValidError("Session limit must be greater than 0.");
      return;
    }

    if (formData.duration <= 0) {
      setValidError("Duration must be greater than 0.");
      return;
    }
    if (selectedPlan) {
      const updatedPlan = await UpdatePlans_API(formData.id, formData);
      if (updatedPlan.success) {
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === formData.id ? { ...plan, ...updatedPlan.plan } : plan
          )
        );
      }
    } else {
      const res = await CreatePlans_API(formData);
      console.log(res);
      if (res.success) {
        setPlans((prevPlans) => [...prevPlans, res.plan]);
      }
      console.log(formData);
    }

    closeModal();
  };
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await GetPlans_API();
        console.log(data);
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);
console.log(plans)
  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isAdmin ? "bg-black" : "bg-gradient-to-b from-gray-900 to-primary"
      }`}
    >
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        {isAdmin ? "Available Plans" : "Choose Your Plan"}
      </h1>
      {user?.isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddClick}
            className="bg-secondary text-white py-2 px-8 rounded"
          >
            Add
          </button>
        </div>
      )}

      {isModalOpen && (
        <SubscriptionModal
          onSubmit={hanldeClick}
          subscriptionData={selectedPlan}
          closeModal={closeModal}
          validateError={validateError}
        />
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <SubCard
            key={plan.id}
            planId={plan.id}
            isActive={plan.isActive}
            name={plan.name}
            price={plan.price.toString()}
            discount={10}
            features={plan.features}
            onEdit={() => handleEditClick(plan)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
