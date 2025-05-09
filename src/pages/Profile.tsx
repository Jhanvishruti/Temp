import { Edit2, Save, Github, Linkedin, Loader2 } from "lucide-react";
import { Contributor, Owner } from "../types";
import { Button } from "../components/Button";
import toast from "react-hot-toast";
import { useState, ChangeEvent, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { getUserIdFromToken, getUserRoleFromToken } from "../services/authService";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Retrieve userType and userId from auth cookie
  const userType = getUserRoleFromToken()||"powner";
  // console.log(userType)
  const userId = getUserIdFromToken();

  const [profileData, setProfileData] = useState<Contributor | Owner >();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // console.log(userType, userId)
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...(prev as Contributor | Owner),
      [name]: value
    }));
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

  // Add this helper function to safely access profile properties
  const getValueOrDefault = (obj: any, key: string, defaultValue: any = '') => {
    if (!obj) return defaultValue;
    return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue;
  };

  // Update the renderContributorProfile function to match your JSON data structure
  const renderContributorProfile = (profile: Contributor) => (
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
              value={getValueOrDefault(profile, 'skills')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Experience Level</label>
            <select
              name="experienceLevel"
              value={getValueOrDefault(profile, 'experienceLevel', 'Beginner')}
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
              value={getValueOrDefault(profile, 'preferredProjectDomain')}
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
              value={getValueOrDefault(profile, 'availability', 'Full-time')}
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
              value={getValueOrDefault(profile, 'preferredCollabType', 'Remote')}
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
                value={getValueOrDefault(profile, 'timeCommitmentValue', 0)}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
              />
              <select
                name="timeUnit"
                value={getValueOrDefault(profile, 'timeUnit', 'months')}
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
              value={getValueOrDefault(profile, 'hoursPerDay')}
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
            value={getValueOrDefault(profile, 'whyContribute')}
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
              value={getValueOrDefault(profile, 'linkedInProfileUrl')}
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
              value={getValueOrDefault(profile, 'gitHubProfileUrl')}
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
              value={getValueOrDefault(profile, 'resumeGoogleDriveLink')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white overflow-hidden text-ellipsis"
              style={{ minHeight: '42px', height: 'auto' }}
            />
          </div>
        </div>
        {/* Removing the social media links display section */}
        {/* <div className="mt-4">
          <div className="flex gap-4">
            {profile.linkedInProfileUrl && (
              <a
                href={profile.linkedInProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
            {profile.gitHubProfileUrl && (
              <a
                href={profile.gitHubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );

  // Update the renderProjectOwnerProfile function to display all fields
  const renderProjectOwnerProfile = (profile: Owner) => (
    <div className="space-y-8">
      {/* Project Information Section */}
      <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
        <h3 className="mb-4 text-lg font-medium text-blue-400">Project Information</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-200">Project Title</label>
            <input
              type="text"
              name="proTitle"
              value={getValueOrDefault(profile, 'proTitle')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Project Type</label>
            <select
              name="proType"
              value={getValueOrDefault(profile, 'proType', 'Personal')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            >
              <option value="Personal">Personal</option>
              <option value="Startup">Startup</option>
              <option value="College">College</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Project Domain</label>
            <input
              type="text"
              name="reqProjectDomain"
              value={getValueOrDefault(profile, 'reqProjectDomain')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white overflow-hidden text-ellipsis"
              title={getValueOrDefault(profile, 'reqProjectDomain')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200">Project Description</label>
            <textarea
              name="proDes"
              value={getValueOrDefault(profile, 'proDes')}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>
        </div>
      </div>

      {/* Collaboration Requirements Section */}
      <div className="rounded-lg border border-gray-700 bg-black/10 p-5">
        <h3 className="mb-4 text-lg font-medium text-blue-400">Collaboration Requirements</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-200">Required Skills</label>
            <input
              type="text"
              name="reqSkills"
              value={getValueOrDefault(profile, 'reqSkills')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Collaboration Mode</label>
            <select
              name="collabMode"
              value={getValueOrDefault(profile, 'collabMode', 'Remote')}
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
            <label className="block text-sm font-medium text-gray-200">Time Required</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="timeNeedValue"
                value={getValueOrDefault(profile, 'timeNeedValue', 0)}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
              />
              <select
                name="timeUnit"
                value={getValueOrDefault(profile, 'timeUnit', 'months')}
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
              type="number"
              name="hoursPerDay"
              value={getValueOrDefault(profile, 'hoursPerDay', 0)}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Compensation Type</label>
            <select
              name="compensationType"
              value={getValueOrDefault(profile, 'compensationType', 'Unpaid')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Equity-based">Equity-based</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200">Additional Requirements</label>
            <textarea
              name="addReq"
              value={getValueOrDefault(profile, 'addReq')}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>
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
              value={getValueOrDefault(profile, 'linkedInProfileUrl')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">GitHub Profile</label>
            <input
              type="url"
              name="gitHubProfileUrl"
              value={getValueOrDefault(profile, 'gitHubProfileUrl')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Resume Link</label>
            <input
              type="url"
              name="resumeGoogleDriveLink"
              value={getValueOrDefault(profile, 'resumeGoogleDriveLink')}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex gap-4">
            {profile.linkedInProfileUrl && (
              <a
                href={profile.linkedInProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            )}
            {profile.githubProfileUrl && (
              <a
                href={profile.githubProfileUrl}
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
      </div>
    </div>
  );

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

        {/* Check if it's a contributor profile based on the userType */}
        {userType.toLowerCase() === 'pcontributor'
          ? renderContributorProfile(profileData as Contributor)
          : renderProjectOwnerProfile(profileData as Owner)
        }
      </div>
    </div>
  );
};

export default Profile;