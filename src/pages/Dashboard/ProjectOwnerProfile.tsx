import React from 'react';
import { X, Clock, MapPin, DollarSign } from 'lucide-react';
import { Button } from '../../components/Button';
import { ProjectOwnerProfile as ProjectOwnerType } from '../../types';

interface ProjectOwnerProfileProps {
  owner: ProjectOwnerType;
  onClose: () => void;
  onSendRequest: (e: React.MouseEvent) => void;
  isPending?: boolean;
  isAccepted?: boolean;
  isRejected?: boolean;
}

export const ProjectOwnerProfile: React.FC<ProjectOwnerProfileProps> = ({
  owner,
  onClose,
  onSendRequest,
  isPending = false,
  isAccepted = false,
  isRejected = false,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center space-x-4">
            <img
              src={owner.profilePictureUrl}
              alt={owner.name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{owner.name}</h2>
              <p className="text-gray-400">{owner.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Details */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Project Details</h3>
            <div className="space-y-2 text-gray-300">
              <h4 className="font-medium text-white">{owner.proTitle}</h4>
              <p className="text-sm">{owner.projectDescription}</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{owner.timeRequired}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{owner.collaborationMode}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{owner.compensationType}</span>
              </div>
            </div>
          </div>

          {/* Project Requirements */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {owner.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Project Information */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Project Information</h3>
            <div className="space-y-2 text-gray-300">
              <p>Type: {owner.projectType}</p>
              <p>Hours per day: {owner.hoursPerDay}</p>
              <p>Collaboration: {owner.collaborationMode}</p>
            </div>
          </div>

          {owner.additionalRequirements && (
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">Additional Requirements</h3>
              <p className="text-gray-300">{owner.additionalRequirements}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {isAccepted ? (
            <span className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
              Request Accepted
            </span>
          ) : isRejected ? (
            <span className="rounded-full bg-red-500/20 px-4 py-2 text-red-400">
              Request Rejected
            </span>
          ) : isPending ? (
            <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-400">
              Request Pending
            </span>
          ) : (
            <Button onClick={onSendRequest}>Send Request</Button>
          )}
        </div>
      </div>
    </div>
  );
};