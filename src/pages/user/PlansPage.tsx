import React, { useEffect, useState } from "react";
import SubCard from "../../components/subscription/SubCard";
import SubscriptionModal from "../../features/subscription/EditSubscription"; // Assuming you have a modal component like this
import {
  CreatePlans_API,
  GetPlans_API,
  UpdatePlans_API,
} from "../../api/PlansApi";
import { Plan } from "../../model/types/user.types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { subscriptionPlan } from "../../utils/Validation";
import * as Yup from "yup";
import { toast } from "react-toastify";

const PlansPage = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[] | []>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
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
    setValidationErrors({});
  };
  const handleSubmit = async (formData: Plan) => {
    setValidationErrors({});

    plans.map((plan) => {
      if (plan.name === formData.name) {
        toast.error("Name already Exists");
      }
      if (plan.price === formData.price) {
        toast.error("Price already Exists");
      }
    });

    try {
      await subscriptionPlan.validate(formData, { abortEarly: false });
      setLoading(true);
      if (selectedPlan) {
        const updatedPlan = await UpdatePlans_API(formData.id, formData);
        if (updatedPlan.success) {
          closeModal();
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
          closeModal();
          setPlans((prevPlans) => [...prevPlans, res.plan]);
        }
        console.log(formData);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      }
    } finally {
      setLoading(false);
    }
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
  console.log(plans);
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
          onSubmit={handleSubmit}
          subscriptionData={selectedPlan}
          closeModal={closeModal}
          //validateError={validateError}
          loading={loading}
          validationErrors={validationErrors}
        />
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {plans?.map((plan) => (
          <SubCard
            key={plan.id}
            planId={plan.id}
            isActive={plan.isActive}
            name={plan.name}
            price={plan.price.toString()}
            discount={10}
            onEdit={() => handleEditClick(plan)}
            ads={plan.ads}
            live={plan.live}
            uhd={plan.uhd}
            sessionLimit={plan.sessionLimit}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
