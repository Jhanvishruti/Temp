import React from 'react';
import { X, Github, Linkedin, Clock, MapPin, Calendar } from 'lucide-react';
import { Button } from '../components/Button'
interface ContributorProfileProps {
  contributor: any;
  onClose: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  status?: 'pending' | 'accepted' | 'rejected';
}

export const ContributorProfile: React.FC<ContributorProfileProps> = ({
  contributor,
  onClose,
  showActions = false,
  onAccept,
  onReject,
  status
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
            src={contributor.profilePicture}
            alt={contributor.name}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{contributor.name}</h2>
            <p className="text-gray-400">{contributor.email}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {contributor.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Experience Level</h3>
            <p className="text-gray-300">{contributor.experienceLevel}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Domain</h3>
            <p className="text-gray-300">{contributor.preferredDomain}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Availability</h3>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{contributor.availability}</span>
              <span>•</span>
              <span>{contributor.hoursPerDay} hours/day</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Collaboration</h3>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{contributor.preferredCollaboration}</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Links</h3>
            <div className="flex gap-3">
              {contributor.linkedinUrl && (
                <a
                  href={contributor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-500/20 p-2 text-blue-300 hover:bg-blue-500/30"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {contributor.githubUrl && (
                <a
                  href={contributor.githubUrl}
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

        {contributor.motivation && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-white">Motivation</h3>
            <p className="text-gray-300">{contributor.motivation}</p>
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

        {status && status !== 'pending' && (
          <div className="mt-6 flex justify-end">
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                status === 'accepted'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {status === 'accepted' ? 'Accepted' : 'Rejected'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};