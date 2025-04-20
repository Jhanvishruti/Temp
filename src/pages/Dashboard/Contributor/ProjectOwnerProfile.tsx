import React from 'react';
import { X, Linkedin, Github, FileText } from 'lucide-react';
import { Owner } from '../../../types';
import { Button } from '../../../components/Button';

interface ProjectOwnerProfileProps {
  owner: Owner;
  onClose: () => void;
}

export const ProjectOwnerProfile: React.FC<ProjectOwnerProfileProps> = ({ owner, onClose }) => {
  // Helper function to safely get values
  const getValueOrDefault = (obj: any, key: string, defaultValue: string = 'Not specified') => {
    return obj[key] || defaultValue;
  };

  // Helper function to format skills array to display properly
  const formatSkills = (skills: any) => {
    if (!skills) return 'Not specified';
    if (Array.isArray(skills)) {
      return skills.length > 0 ? skills.join(', ') : 'Not specified';
    }
    return skills;
  };

  // Helper function to check if a URL is valid
  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6 flex items-center space-x-4">
          <img
            src={owner.profilePictureUrl}
            alt={owner.fullName}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{owner.fullName}</h2>
            <p className="text-gray-400">{owner.email}</p>
            
            {/* Social Media Links */}
            <div className="mt-2 flex space-x-3">
              {owner.linkedInProfileUrl && isValidUrl(owner.linkedInProfileUrl) && (
                <a 
                  href={owner.linkedInProfileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              
              {owner.githubProfileUrl && isValidUrl(owner.githubProfileUrl) && (
                <a 
                  href={owner.githubProfileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300"
                  title="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              
              {owner.resumeGoogleDriveLink && isValidUrl(owner.resumeGoogleDriveLink) && (
                <a 
                  href={owner.resumeGoogleDriveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300"
                  title="Google Drive"
                >
                  <FileText className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="mb-6 rounded-lg border border-gray-700 bg-black/20 p-4">
          <h3 className="mb-3 text-xl font-semibold text-blue-400">Project Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-400">Project Title</p>
              <p className="text-white">{getValueOrDefault(owner, 'proTitle')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Project Type</p>
              <p className="text-white">{getValueOrDefault(owner, 'proType')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Project Domain</p>
              <p className="text-white">{getValueOrDefault(owner, 'reqProjectDomains')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Collaboration Mode</p>
              <p className="text-white">{getValueOrDefault(owner, 'collabMode')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-400">Project Description</p>
              <p className="text-white">{getValueOrDefault(owner, 'proDes')}</p>
            </div>
          </div>
        </div>

        {/* Collaboration Requirements */}
        <div className="mb-6 rounded-lg border border-gray-700 bg-black/20 p-4">
          <h3 className="mb-3 text-xl font-semibold text-blue-400">Collaboration Requirements</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-400">Required Skills</p>
              <p className="text-white">{formatSkills(owner.reqSkills)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Time Commitment</p>
              <p className="text-white">
                {getValueOrDefault(owner, 'timeCommitValue')} {getValueOrDefault(owner, 'timeUnit')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Compensation Type</p>
              <p className="text-white">{getValueOrDefault(owner, 'compensationType')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-400">Additional Requirements</p>
              <p className="text-white">{getValueOrDefault(owner, 'addReq')}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary" className="mr-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};