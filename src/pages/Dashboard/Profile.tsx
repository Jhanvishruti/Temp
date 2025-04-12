import { Edit2, Save, Github, Linkedin, Loader2 } from "lucide-react";
import { ContributorProfile, ProjectOwnerProfile } from "../../types";
import { Button } from "../../components/Button";
import toast from "react-hot-toast";
import { useState, ChangeEvent, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../services/api";
import { getUserIdFromToken, getUserRoleFromToken } from "../../services/authService";

// const mockContributorData: ContributorProfile = {
//   id: '1',
//   profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//   name: 'John Doe',
//   email: 'john@example.com',
//   type: 'contributor',
//   skills: 'React, TypeScript, Node.js, GraphQL',
//   experienceLevel: 'Expert',
//   preferredProjectDomain: 'Web Development',
//   availability: 'Full-time',
//   preferredCollabType: 'Remote',
//   timeCommitmentValue: 6,
//   time: 'months',
//   hoursPerDay: '8',
//   linkedInProfileUrl: 'https://linkedin.com/in/johndoe',
//   gitHubProfileUrl: 'https://github.com/johndoe',
//   resumeGoogleDriveLink: 'https://drive.google.com/johndoe-resume',
//   whyContribute: 'Passionate about building scalable web applications and contributing to innovative projects.'
// };

// const mockProjectOwnerData: ProjectOwnerProfile = {
//   id: '2',
//   profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
//   name: 'Jane Smith',
//   email: 'jane@example.com',
//   type: 'project-owner',
//   proTitle: 'Innovative Web App',
//   proDes: 'A cutting-edge web application using modern technologies',
//   reqProjectDomain: 'Web Development',
//   reqSkills: 'React, Node.js, AWS, MongoDB',
//   proType: 'Startup',
//   collabMode: 'Remote',
//   timeNeedValue: 6,
//   timeUnit: 'months',
//   hoursPerDay: '6',
//   linkedInProfileUrl: 'https://linkedin.com/in/janesmith',
//   gitHubProfileUrl: 'https://github.com/janesmith',
//   resumeGoogleDriveLink: 'https://drive.google.com/janesmith-resume',
//   compensationType: 'Equity-based',
//   addReq: 'Looking for passionate developers with experience in modern web technologies'
// };

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // For demo purposes, hardcoded values - in real app, these would come from auth context
  // Retrieve userType and userId from auth cookie
  const userType = getUserRoleFromToken() || "contributor";
  const userId = getUserIdFromToken() || 1;

  const [profileData, setProfileData] = useState<ContributorProfile | ProjectOwnerProfile | null>(null);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...(prev as ContributorProfile | ProjectOwnerProfile),
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

  const renderContributorProfile = (profile: ContributorProfile) => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-200">Skills</label>
        <input
          type="text"
          name="skills"
          value={profile.skills}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Experience Level</label>
        <select
          name="experienceLevel"
          value={profile.experienceLevel}
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
          value={profile.preferredProjectDomain}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Availability</label>
        <select
          name="availability"
          value={profile.availability}
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
          value={profile.preferredCollabType}
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
        <label className="block text-sm font-medium text-gray-200">Hours Per Day</label>
        <input
          type="text"
          name="hoursPerDay"
          value={profile.hoursPerDay}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200">Why Contribute</label>
        <textarea
          name="whyContribute"
          value={profile.whyContribute}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Social Links</label>
        <div className="mt-2 flex gap-4">
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
      </div>
    </div>
  );

  const renderProjectOwnerProfile = (profile: ProjectOwnerProfile) => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-200">Project Title</label>
        <input
          type="text"
          name="proTitle"
          value={profile.proTitle}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Project Type</label>
        <select
          name="proType"
          value={profile.proType}
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

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-200">Project Description</label>
        <textarea
          name="proDes"
          value={profile.proDes}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Required Skills</label>
        <input
          type="text"
          name="reqSkills"
          value={profile.reqSkills}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Collaboration Mode</label>
        <select
          name="collabMode"
          value={profile.collabMode}
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
            value={profile.timeNeedValue}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
          />
          <select
            name="timeUnit"
            value={profile.timeUnit}
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
          value={profile.hoursPerDay}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Compensation Type</label>
        <select
          name="compensationType"
          value={profile.compensationType}
          onChange={handleInputChange}
          disabled={!isEditing}
          className="mt-1 w-full rounded-lg border border-gray-600 bg-black/20 px-4 py-2 text-white"
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Equity-based">Equity-based</option>
        </select>
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
          <img
            src={profileData.profilePictureUrl}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover"
          />
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block text-lg font-medium text-white bg-transparent border-b border-transparent focus:border-gray-500 outline-none disabled:border-transparent"
            />
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="block text-gray-400 bg-transparent border-b border-transparent focus:border-gray-500 outline-none disabled:border-transparent"
            />
          </div>
        </div>

        {profileData.type === 'contributor'
          ? renderContributorProfile(profileData as ContributorProfile)
          : renderProjectOwnerProfile(profileData as ProjectOwnerProfile)
        }
      </div>
    </div>
  );
};

export default Profile;