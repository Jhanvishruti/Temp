import React, { useState, useEffect } from 'react';
import { UserX } from 'lucide-react';
import { Button } from '../components/Button';
import { FeedbackModal } from './FeedbackModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserIdFromToken } from '../services/authService';

interface Collaboration {
  id: string;
  contributorId: string;
  contributorName: string;
  contributorImage: string;
  projectTitle: string;
  startDate: string;
  status: 'active' | 'completed';
}

export const ProjectCollaborations: React.FC = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'powner' | 'contributor'>('contributor');

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axios.get(`http://localhost:5247/api/collaboration/user/${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setCollaborations(data);
        setUserRole(data[0]?.ownerId === userId ? 'powner' : 'contributor');
      } catch (err) {
        setError('Failed to fetch collaborations');
        toast.error('Failed to load collaborations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);

  const handleEndCollaboration = (collaboration: Collaboration) => {
    setSelectedCollaboration(collaboration);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (feedback: { rating: number; comment: string }) => {
    if (selectedCollaboration) {
      try {
        await axios.post(`http://localhost:5247/api/collaboration/${selectedCollaboration.id}/end`, null, {
          params: { pownerId: getUserIdFromToken() }
        });
        
        await axios.post(`http://localhost:5247/api/feedback/collaboration/${selectedCollaboration.id}`, feedback);

        setCollaborations(prevCollabs =>
          prevCollabs.map(collab =>
            collab.id === selectedCollaboration.id
              ? { ...collab, status: 'completed' as const }
              : collab
          )
        );

        toast.success('Collaboration ended successfully');
        setShowFeedbackModal(false);
        setSelectedCollaboration(null);
      } catch (err) {
        toast.error('Failed to end collaboration');
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-black/20 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Project Collaborations
      </h2>

      <div className="space-y-4">
        {collaborations.map((collaboration) => (
          <div
            key={collaboration.id}
            className="rounded-lg border border-gray-700 bg-black/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={collaboration.contributorImage}
                  alt={collaboration.contributorName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {collaboration.contributorName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {collaboration.projectTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    Started: {collaboration.startDate}
                  </p>
                </div>
              </div>
              {collaboration.status === 'active' && (
                <Button
                  variant="secondary"
                  onClick={() => handleEndCollaboration(collaboration)}
                  className="gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  disabled={userRole !== 'powner'}
                >
                  <UserX className="h-5 w-5" />
                  {userRole === 'powner' ? 'End Collaboration' : 'Only Owner Can End'}
                </Button>
              )}
              {collaboration.status === 'completed' && (
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading collaborations...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      ) : collaborations.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-black/10 p-6 text-center">
          <p className="text-gray-400">No active collaborations</p>
        </div>
      ) : null}
      </div>

      {showFeedbackModal && selectedCollaboration && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
          contributorName={selectedCollaboration.contributorName}
        />
      )}
    </div>
  );
};