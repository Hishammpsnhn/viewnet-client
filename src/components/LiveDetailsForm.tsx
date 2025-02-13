import React, { useState, ChangeEvent, FormEvent } from 'react';
import { LiveDetailModel } from '../model/types/live.types';



interface FormErrors {
  title?: string;
  description?: string;
  [key: string]: string | undefined;
}

interface LiveDetailFormProps {
//   liveDetailModel: LiveDetailModel | null;
  onSubmit: (data: LiveDetailModel) => void;
  onClose: () => void;
}

interface FormData extends Required<LiveDetailModel> {
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

type Category = typeof CATEGORIES[number]['value'];

const LiveDetailForm: React.FC<LiveDetailFormProps> = ({ 
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = useState<FormData>({
    title:  '',
    description: '',
    genre:  'general',
    tags:  '',
    isPrivate: false,
    thumbnailUrl:''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Live Stream Details</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-200"
            >
              Stream Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter your stream title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-200"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Describe your stream"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label 
              htmlFor="genre" 
              className="block text-sm font-medium text-gray-200"
            >
              Category
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {CATEGORIES.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label 
              htmlFor="tags" 
              className="block text-sm font-medium text-gray-200"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="gaming, streaming, fun"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
            />
            <label 
              htmlFor="isPrivate" 
              className="text-sm font-medium text-gray-200"
            >
              Private Stream
            </label>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label 
              htmlFor="thumbnailUrl" 
              className="block text-sm font-medium text-gray-200"
            >
              Thumbnail URL (optional)
            </label>
            <input
              type="text"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Start Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveDetailForm;