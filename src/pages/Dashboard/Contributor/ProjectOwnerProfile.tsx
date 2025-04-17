import React from 'react';
import { X, Clock, MapPin, Linkedin, Github } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Owner as ProjectOwnerType } from '../../../types';

interface ProjectOwnerProfileProps {
    owner: ProjectOwnerType;
    onClose: () => void;
    showActions?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
}

export const ProjectOwnerProfile: React.FC<ProjectOwnerProfileProps> = ({
    owner,
    onClose,
    showActions = false,
    onAccept,
    onReject,
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
    
            <div className="mb-6 flex items-center space-x-4">
              <img
                src={owner.profilePictureUrl}
                alt={owner.fullName}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{owner.proTitle}</h2>
                <p className="text-gray-400">{owner.proType}</p>
              </div>
            </div>
    
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(owner.reqSkills) && owner.reqSkills.length > 0 ? owner.reqSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                    >
                      {skill}
                    </span>
                  )) : (
                    <span className="text-gray-400">No skills listed</span>
                  )}
                </div>
              </div>
    
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Collab Mode</h3>
                <p className="text-gray-300">{owner.collabMode}</p>
              </div>
    
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Compensation Type</h3>
                <p className="text-gray-300">{owner.compensationType}</p>
              </div>
    
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Availability</h3>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{owner.hoursPerDay} hours/day</span>
                </div>
              </div>
    
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Description</h3>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{owner.proDes}</span>
                </div>
              </div>
    
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Links</h3>
                <div className="flex gap-3">
                  {owner.linkedInProfileUrl && (
                    <a
                      href={owner.linkedInProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-blue-500/20 p-2 text-blue-300 hover:bg-blue-500/30"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {owner.githubProfileUrl && (
                    <a
                      href={owner.githubProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
    
            {owner.addReq && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold text-white">Motivation</h3>
                <p className="text-gray-300">{owner.addReq}</p>
              </div>
            )}
    
            {showActions && status === 'pending' && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button onClick={onAccept}>Accept Request</Button>
                <Button
                  variant="secondary"
                  onClick={onReject}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  Reject Request
                </Button>
              </div>
            )}
          </div>
        </div>
      );
};