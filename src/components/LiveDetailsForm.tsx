import React, { useState, ChangeEvent, FormEvent } from 'react';
import { LiveDetailModel } from '../model/types/live.types';
import axios from 'axios'; 

interface FormErrors {
  title?: string;
  description?: string;
  [key: string]: string | undefined;
}

interface LiveDetailFormProps {
  onSubmit: (data: LiveDetailModel) => void;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  genre: string;
  tags: string;
  isPrivate: boolean;
  thumbnailUrl: string;
}

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'music', label: 'Music' },
] as const;

const LiveDetailForm: React.FC<LiveDetailFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    genre: 'general',
    tags: '',
    isPrivate: false,
    thumbnailUrl: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [uploading, setUploading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");

    try {
       const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
      setFormData(prev => ({ ...prev, thumbnailUrl: response.data.secure_url }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="border-b border-gray-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Live Stream Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">Stream Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`} placeholder="Enter your stream title"/>
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4}
              className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              }`} placeholder="Describe your stream"/>
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-200">Category</label>
            <select id="genre" name="genre" value={formData.genre} onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {CATEGORIES.map(genre => (
                <option key={genre.value} value={genre.value}>{genre.label}</option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-200">Thumbnail</label>
            <input type="file" id="thumbnailUrl" name="thumbnailUrl" accept="image/*" onChange={handleImageChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"/>
            {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            {formData.thumbnailUrl && (
              <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-40 object-cover mt-2 rounded-lg"/>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Start Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveDetailForm;
