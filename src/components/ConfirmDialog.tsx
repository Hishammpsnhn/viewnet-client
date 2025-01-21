import React from "react";
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  message,
}) => {
  if (!open) return null; // Don't render the dialog if it's not open

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-primary bg-opacity-50 z-50">
      <div className="bg-black text-white rounded-lg shadow-lg w-96 p-6 border">
        <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
