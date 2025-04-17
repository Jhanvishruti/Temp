import React from 'react';
import { X, Clock, MapPin, DollarSign, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '../../components/Button';
import { User } from '../../types';

interface ContributorProfileType extends User {
  skills: string;
  experience: string;
  education: string;
  preferredDomain: string;
  preferredProjectType: string;
  availability: string;
  hoursPerDay: string;
  preferredCollabMode: string;
  linkedInProfileUrl: string;
  gitHubProfileUrl: string;
  resumeGoogleDriveLink: string;
  preferredCompensationType: string;
  additionalInfo: string;
  skillsList?: string[];
}

interface ContributorProfileProps {
  contributor: ContributorProfileType;
  onClose: () => void;
  onSendRequest: (e: React.MouseEvent) => void;
  isPending?: boolean;
  isAccepted?: boolean;
  isRejected?: boolean;
}

export const ContributorProfile: React.FC<ContributorProfileProps> = ({
  contributor,
  onClose,
  onSendRequest,
  isPending = false,
  isAccepted = false,
  isRejected = false,
}) => {
  // Parse skills if not already parsed
  const skills = contributor.skillsList || 
    (contributor.skills ? contributor.skills.split(',').map(skill => skill.trim()) : []);

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
              src={contributor.profilePictureUrl}
              alt={contributor.name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{contributor.name}</h2>
              <p className="text-gray-400">{contributor.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Skills */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Experience</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{contributor.experience}</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Education</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>{contributor.education}</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Preferences</h3>
            <div className="space-y-2 text-gray-300">
              <p>Domain: {contributor.preferredDomain}</p>
              <p>Project Type: {contributor.preferredProjectType}</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Availability: {contributor.availability}</span>
              </div>
              <p>Hours per day: {contributor.hoursPerDay}</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Collaboration: {contributor.preferredCollabMode}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Compensation: {contributor.preferredCompensationType}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {contributor.additionalInfo && (
            <div className="md:col-span-2">
              <h3 className="mb-2 text-lg font-semibold text-white">Additional Information</h3>
              <p className="text-gray-300">{contributor.additionalInfo}</p>
            </div>
          )}

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="mb-2 text-lg font-semibold text-white">Links</h3>
            <div className="space-y-2 text-gray-300">
              {contributor.linkedInProfileUrl && (
                <p>
                  <a 
                    href={contributor.linkedInProfileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </p>
              )}
              {contributor.gitHubProfileUrl && (
                <p>
                  <a 
                    href={contributor.gitHubProfileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    GitHub Profile
                  </a>
                </p>
              )}
              {contributor.resumeGoogleDriveLink && (
                <p>
                  <a 
                    href={contributor.resumeGoogleDriveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Resume
                  </a>
                </p>
              )}
            </div>
          </div>
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