import React, { useEffect, useState } from "react";
import SubCard from "../../components/subscription/SubCard";
import SubscriptionModal from "../../features/subscription/EditSubscription"; // Assuming you have a modal component like this
import {
  CreatePlans_API,
  GetPlans_API,
  UpdatePlans_API,
} from "../../api/Sub-Plan/Plans";
import { Plan } from "../../model/types/user.types";

const PlansPage = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[] | []>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [validateError, setValidError] = useState<string | null>(null);

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
    console.log(formData);
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
      const data = await UpdatePlans_API(formData.id, formData);
      console.log(formData);
    } else {
      const data = await CreatePlans_API(formData);
      console.log(formData);
    }

    closeModal();
  };
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await GetPlans_API();
        console.log(data);
        if (data && data.plans) setPlans(data.plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isAdmin ? "bg-black" : "bg-primary"
      }`}
    >
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
        {isAdmin ? "Available Plans" : "Choose Your Plan"}
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddClick}
          className="bg-secondary text-white py-2 px-8 rounded"
        >
          Add
        </button>
      </div>

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
