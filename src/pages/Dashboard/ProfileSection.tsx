// 
// 
// check this file working for both contributor and project owner
// 
// 

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getUserIdFromToken } from '../../services/authService';
import { Button } from '../../components/Button';

interface ProfileSectionProps {
  userType: 'contributor' | 'project-owner';
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userType }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth='))?.split('=')[1];
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const endpoint = userType === 'contributor' 
          ? `http://localhost:5247/api/pcontributor/${getUserIdFromToken()}` 
          : `http://localhost:5247/api/powner/${getUserIdFromToken()}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading profile data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">No profile data found. Please complete your profile.</div>
      </div>
    );
  }

  // Render different UI based on user type
  if (userType === 'contributor') {
    return (
      <div className="space-y-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profileData.profilePictureUrl || 'https://via.placeholder.com/150'}
            alt={profileData.fullName}
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{profileData.fullName}</h3>
            <p className="text-gray-300">{profileData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Preferred Domain</h4>
              <p className="text-white">{profileData.preferredProjectDomain}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {profileData.skills.split(',').map((skill: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-600 rounded-full text-xs text-white">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Experience Level</h4>
              <p className="text-white">{profileData.experienceLevel}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Time Commitment</h4>
              <p className="text-white">{`${profileData.timeCommitmentValue} ${profileData.timeUnit}`}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Hours Per Day</h4>
              <p className="text-white">{profileData.hoursPerDay}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Availability</h4>
              <p className="text-white">{profileData.availability}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Preferred Collaboration Type</h4>
          <p className="text-white">{profileData.preferredCollabType}</p>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Why I Want to Contribute</h4>
          <p className="text-white">{profileData.whyContribute}</p>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Professional Links</h4>
          <div className="space-y-2">
            {profileData.linkedInProfileUrl && (
              <a href={profileData.linkedInProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
            {profileData.gitHubProfileUrl && (
              <a href={profileData.gitHubProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            )}
            {profileData.resumeGoogleDriveLink && (
              <a href={profileData.resumeGoogleDriveLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5 1.41-1.41 3.59 3.59 7.59-7.59 1.41 1.41-9 9z" />
                </svg>
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // Project Owner Profile
    return (
      <div className="space-y-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profileData.profilePictureUrl || 'https://via.placeholder.com/150'}
            alt={profileData.name}
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{profileData.name}</h3>
            <p className="text-gray-300">{profileData.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Project Title</h4>
                  <p className="text-white">{profileData.proTitle}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Project Description</h4>
                  <p className="text-white">{profileData.proDes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Project Domain</h4>
                  <p className="text-white">{profileData.reqProjectDomain}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Project Type</h4>
                  <p className="text-white">{profileData.proType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Required Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.reqSkills.split(',').map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-600 rounded-full text-xs text-white">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Collaboration Mode</h4>
                  <p className="text-white">{profileData.collabMode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Time Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Time Needed</h4>
                <p className="text-white">{`${profileData.timeNeedValue} ${profileData.timeUnit}`}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Hours Per Day</h4>
                <p className="text-white">{profileData.hoursPerDay}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Compensation</h3>
            <p className="text-white">{profileData.compensationType}</p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Additional Requirements</h3>
            <p className="text-white">{profileData.addReq || 'None specified'}</p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-2">Professional Links</h3>
            <div className="space-y-2">
              {profileData.linkedInProfileUrl && (
                <a href={profileData.linkedInProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {profileData.gitHubProfileUrl && (
                <a href={profileData.gitHubProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </a>
              )}
              {profileData.resumeGoogleDriveLink && (
                <a href={profileData.resumeGoogleDriveLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5 1.41-1.41 3.59 3.59 7.59-7.59 1.41 1.41-9 9z" />
                  </svg>
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProfileSection;