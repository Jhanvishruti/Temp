import { Edit2, Save, Github, Linkedin, Loader2 } from "lucide-react";
import { Contributor } from "../../../types";
import { Button } from "../../../components/Button";
import toast from "react-hot-toast";
import { useState, ChangeEvent, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../../services/api";
import { getUserIdFromToken, getUserRoleFromToken } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Retrieve userType and userId from auth cookie
  const userType = getUserRoleFromToken() || "contributor";
  const userId = getUserIdFromToken();

  // Redirect to appropriate profile page based on user role
  useEffect(() => {
    // Only redirect if we have a valid userType and it's not "contributor"
    if (userType && userType !== "contributor") {
      navigate(`/dashboard/${userType === "powner" ? "owner" : userType}/profile`);
    }
  }, [userType, navigate]);

  const [profileData, setProfileData] = useState<Contributor>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userType, userId.toString());
        setProfileData(data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userType, userId]);

  // Modify the skills field to ensure it's stored as an array
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for skills to ensure it's stored as an array
    if (name === 'skills') {
      // Convert comma-separated string to array
      const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
      setProfileData(prev => ({
        ...(prev as Contributor),
        [name]: skillsArray
      }));
    } else {
      setProfileData(prev => ({
        ...(prev as Contributor),
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    setIsSaving(true);
    try {
      await updateUserProfile(userType, profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to safely access profile properties
  const getValueOrDefault = (obj: any, key: string, defaultValue: any = '') => {
    if (!obj) return defaultValue;
    return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-black/20 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">My Profile</h2>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant="secondary"
          className="gap-2"
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-5 w-5" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full border-2 border-gray-600 overflow-hidden flex items-center justify-center bg-gray-700">
            {profileData?.profilePictureUrl ? (
              <img
                src={profileData.profilePictureUrl}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full w-full text-white text-xl font-bold">' + 
                    (profileData.fullName?.charAt(0) || 'U') + '</div>';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-white text-xl font-bold">
                {profileData?.fullName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="text"
              name="fullName"
              value={getValueOrDefault(profileData, 'fullName', '')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block text-lg font-medium text-white bg-transparent border-b border-transparent focus:border-gray-500 outline-none disabled:border-transparent"
            />
            <input
              type="email"
              name="email"
              value={getValueOrDefault(profileData, 'email', '')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block text-gray-400 bg-transparent border-b border-transparent focus:border-gray-500 outline-none disabled:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Skills & Experience Section */}
          <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
            <h3 className="mb-4 text-lg font-medium text-blue-400">Skills & Experience</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-200">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={Array.isArray(profileData.skills) 
                    ? profileData.skills.join(', ') 
                    : getValueOrDefault(profileData, 'skills')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                  placeholder="Enter skills separated by commas (e.g. React, TypeScript, Node.js)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={getValueOrDefault(profileData, 'experienceLevel', 'Beginner')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Preferred Project Domain</label>
                <input
                  type="text"
                  name="preferredProjectDomain"
                  value={getValueOrDefault(profileData, 'preferredProjectDomain')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Availability & Preferences Section */}
          <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
            <h3 className="mb-4 text-lg font-medium text-blue-400">Availability & Preferences</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-200">Availability</label>
                <select
                  name="availability"
                  value={getValueOrDefault(profileData, 'availability', 'Full-time')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Weekend only">Weekend only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Preferred Collaboration Type</label>
                <select
                  name="preferredCollabType"
                  value={getValueOrDefault(profileData, 'preferredCollabType', 'Remote')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Time Commitment</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="timeCommitmentValue"
                    value={getValueOrDefault(profileData, 'timeCommitmentValue', 0)}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                  />
                  <select
                    name="timeUnit"
                    value={getValueOrDefault(profileData, 'timeUnit', 'months')}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Hours Per Day</label>
                <input
                  type="text"
                  name="hoursPerDay"
                  value={getValueOrDefault(profileData, 'hoursPerDay')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Motivation Section */}
          <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
            <h3 className="mb-4 text-lg font-medium text-blue-400">Motivation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-200">Why Contribute</label>
              <textarea
                name="whyContribute"
                value={getValueOrDefault(profileData, 'whyContribute')}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
              />
            </div>
          </div>

          {/* Professional Links Section */}
          <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
            <h3 className="mb-4 text-lg font-medium text-blue-400">Professional Links</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-200">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedInProfileUrl"
                  value={getValueOrDefault(profileData, 'linkedInProfileUrl')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white overflow-hidden text-ellipsis"
                  style={{ minHeight: '42px', height: 'auto' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">GitHub Profile</label>
                <input
                  type="url"
                  name="gitHubProfileUrl"
                  value={getValueOrDefault(profileData, 'gitHubProfileUrl')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white overflow-hidden text-ellipsis"
                  style={{ minHeight: '42px', height: 'auto' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">Resume Link</label>
                <input
                  type="url"
                  name="resumeGoogleDriveLink"
                  value={getValueOrDefault(profileData, 'resumeGoogleDriveLink')}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white overflow-hidden text-ellipsis"
                  style={{ minHeight: '42px', height: 'auto' }}
                />
              </div>
            </div>
            {!isEditing && (
              <div className="mt-4">
                <div className="flex gap-4">
                  {profileData.linkedInProfileUrl && (
                    <a
                      href={profileData.linkedInProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                    </a>
                  )}
                  {profileData.gitHubProfileUrl && (
                    <a
                      href={profileData.gitHubProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;