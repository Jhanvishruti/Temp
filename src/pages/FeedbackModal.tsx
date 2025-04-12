import React, { useState } from 'react';
import ReactStars from 'react-stars';
import { X } from 'lucide-react';
import { Button } from '../components/Button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
  contributorName: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contributorName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            Feedback for Collaboration with {contributorName}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Rating
            </label>
            <div className="mt-2">
              <ReactStars
                count={5}
                value={rating}
                onChange={setRating}
                size={24}
                color2="#60A5FA"
                half={false}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Your Experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white placeholder-gray-400"
              placeholder="Share your experience working with this contributor..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Feedback</Button>
          </div>
        </form>
      </div>
    </div>
  );
}