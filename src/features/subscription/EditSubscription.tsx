import React, { useState, useEffect } from "react";
import { CreatePlans_API, UpdatePlans_API } from "../../api/Sub-Plan/Plans";
import { Plan } from "../../model/types/user.types";

interface EditSubscriptionProps {
  closeModal: () => void;
  subscriptionData: Plan | null;
  onSubmit: (subscriptionData: any) => void;
  validateError: string | null;
}

const EditSubscription: React.FC<EditSubscriptionProps> = ({
  closeModal,
  subscriptionData,
  onSubmit,
  validateError,
}) => {
  const [formData, setFormData] = useState<Plan>({
    id: subscriptionData?.id || "",
    name: subscriptionData?.name || "",
    description: subscriptionData?.description || "",
    price: subscriptionData?.price || 0,
    sessionLimit: subscriptionData?.sessionLimit || 0,
    duration: subscriptionData?.duration || 0,
    features: subscriptionData?.features || [],
    isActive: subscriptionData?.isActive || true,
    live: subscriptionData?.live || false,
    uhd: subscriptionData?.uhd || false,
    ads: subscriptionData?.ads || false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "features"
          ? value.split(",").map((item: string) => item.trim())
          : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name, checked);
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const handleSubmit = () => {
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative border p-6 rounded-lg w-3/4 md:w-3/6 lg:w-2/6 bg-black">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-700"
        >
          X
        </button>

        <h2 className="text-xl font-semibold mb-4 text-white text-center">
          {subscriptionData ? "Edit Subscription" : "Add Subscription"}
        </h2>

        <div className="flex flex-col items-center">
          {validateError && (
            <p className="text-sm text-red-700 mb-2 w-full">{validateError}</p>
          )}

          <div className="mb-4 w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter subscription name"
              className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
            />
          </div>

          <div className="mb-4 w-full">
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter subscription description"
              className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full mb-4">
            <div className="w-full md:w-[48%]">
              <label className="text-white">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
              />
            </div>

            <div className="w-full md:w-[48%]">
              <label className="text-white">Device Limit</label>
              <input
                type="number"
                name="sessionLimit"
                value={formData.sessionLimit}
                onChange={handleInputChange}
                placeholder="Enter session limit"
                className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full mb-4">
            <div className="w-full md:w-[48%]">
              <label className="text-white">Duration (In Days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Enter duration (in days)"
                className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
              />
            </div>

            <div className="w-full md:w-[48%]">
              <label className="text-white">Features</label>
              <input
                type="text"
                name="features"
                value={formData.features.join(", ")}
                onChange={handleInputChange}
                placeholder="Enter features (comma separated)"
                className="w-full p-2 mt-1 border border-secondary bg-black text-white rounded-md"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="inline-flex items-center cursor-pointer ">
              <input
                type="checkbox"
                checked={formData.ads}
                onChange={handleCheckboxChange}
                name="ads"
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-4   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-secondary"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Ads Free
              </span>
            </label>
          </div>
          <div className="w-full">
            <label className="inline-flex items-center cursor-pointer ">
              <input
                type="checkbox"
                checked={formData.uhd}
                onChange={handleCheckboxChange}
                name="uhd"
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-4   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-secondary"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                4K Access
              </span>
            </label>
          </div>
          <div className="w-full">
            <label className="inline-flex items-center cursor-pointer ">
              <input
                type="checkbox"
                name="live"
                checked={formData.live}
                onChange={handleCheckboxChange}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-4   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-secondary"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Live Streaming Available
              </span>
            </label>
          </div>
          <div className="flex items-center justify-between mb-3 w-full">
            <div>
              <label htmlFor="isActive" className="text-sm text-white">
                Is Active?
              </label>
            </div>
            <div className="mb-4 my-auto flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
            </div>
          </div>

          <button
            className="w-full py-2 bg-secondary text-black rounded-md opacity-80 hover:opacity-85"
            onClick={handleSubmit}
          >
            {subscriptionData ? "Update Subscription" : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubscription;
