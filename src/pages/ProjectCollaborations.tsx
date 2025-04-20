import React, { useState, useEffect } from 'react';
import { UserX } from 'lucide-react';
import { Button } from '../components/Button';
import { FeedbackModal } from './FeedbackModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserIdFromToken, getUserRoleFromToken } from '../services/authService';

interface Collaboration {
  id: number;
  pownerId: number;
  contributorIds: number[];
  isActive: boolean;
  startedAt: string;
  endedAt: string | null;
  feedbackIds: any[];
  contributorName?: string; // Keep for UI display
  contributorImage?: string; // Keep for UI display
  projectTitle?: string; // Keep for UI display
  status?: 'active' | 'completed'; // Derived from isActive
}


interface ProjectCollaborationsProps {
  isProjectOwner?: boolean;
  onEndCollaboration?: (collaborationId: number) => void;
}

export const ProjectCollaborations: React.FC<ProjectCollaborationsProps> = ({ 
  isProjectOwner
}) => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'Powner' | 'contributor'>('Powner');
  var role=getUserRoleFromToken(); 
  // console.log(role);
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axios.get(`http://localhost:5247/api/collaboration/user/${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        console.log(data);
        
        // Transform the data to include status based on isActive
        const transformedData = data.map(collab => ({
          ...collab,
          status: collab.isActive ? 'active' : 'completed'
        }));
        
        setCollaborations(transformedData);
        setUserRole(role === 'Powner' ? 'Powner' : 'contributor');
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
  const handleFeedbackSubmit = async (feedback: { Rating: number; Comments: string }) => {
    if (selectedCollaboration) {
      try {
        const pownerId = getUserIdFromToken();
  
        // 1. End collaboration - send pownerId directly as a number, not as JSON
        await axios.post(
          `http://localhost:5247/api/collaboration/${selectedCollaboration.id}/end`,
          pownerId, // Send the number directly, not wrapped in an object or stringified
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const data = {
          ...feedback,
          ReviewerId : pownerId,
          CollaborationId: selectedCollaboration.id
        }
        console.log(data)
        // 2. Submit feedback
        await axios.post(
          `http://localhost:5247/api/feedback/collaboration/${selectedCollaboration.id}`,
          data, // Send the object directly, no need to stringify with axios
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        // 3. Update UI
        setCollaborations(prevCollabs =>
          prevCollabs.map(collab =>
            collab.id === selectedCollaboration.id
              ? { ...collab, isActive: false, status: 'completed' as const }
              : collab
          )
        );
  
        toast.success('Collaboration ended successfully. Contributor has been notified for feedback.');
        setShowFeedbackModal(false);
        setSelectedCollaboration(null);
      } catch (err) {
        toast.error('Failed to end collaboration');
        console.error('Error ending collaboration:', err);
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
                  src={collaboration.contributorImage || '/default-avatar.png'}
                  alt={collaboration.contributorName}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/default-avatar.png';
                  }}
                />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {collaboration.contributorName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {collaboration.projectTitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    Started: {new Date(collaboration.startedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {(collaboration.status === 'active' || collaboration.isActive) && role === 'Powner' && (
                <Button
                  variant="secondary"
                  onClick={() => handleEndCollaboration(collaboration)}
                  className="gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <UserX className="h-5 w-5" />
                  End Collaboration
                </Button>
              )}
              {(collaboration.status === 'completed' || !collaboration.isActive) && (
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
          contributorName={selectedCollaboration.contributorName || ''}
        />
      )}
    </div>
  );
};

export default ProjectCollaborations;
