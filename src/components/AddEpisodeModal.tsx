import React, { useState } from 'react';


interface EpisodeData {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface EpisodeModalProps {
  onClose: () => void;
  onSubmit: (data: EpisodeData) => void;
}

const EpisodeModal: React.FC<EpisodeModalProps> = ({ onClose, onSubmit }) => {
  const [episodeData, setEpisodeData] = useState<EpisodeData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: ''
  });

  const [previews, setPreviews] = useState({
    thumbnail: '',
    video: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEpisodeData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnailUrl' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [field === 'thumbnailUrl' ? 'thumbnail' : 'video']: previewUrl
    }));

    // Update form data
    setEpisodeData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(episodeData);
      onClose();
    } catch (error) {
      console.error('Error submitting episode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (previews.thumbnail) URL.revokeObjectURL(previews.thumbnail);
      if (previews.video) URL.revokeObjectURL(previews.video);
    };
  }, [previews]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl max-w-2xl w-full m-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Episode</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={episodeData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={episodeData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "thumbnailUrl")}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                required
              />
              {previews.thumbnail && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={previews.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, "videoUrl")}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                required
              />
              {previews.video && (
                <div className="relative w-full rounded-lg overflow-hidden">
                  <video
                    src={previews.video}
                    controls
                    className="w-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpisodeModal;