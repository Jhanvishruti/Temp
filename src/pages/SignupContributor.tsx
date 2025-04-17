import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Users, Upload } from 'lucide-react';
import { Button } from '../components/Button';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { getUserIdFromToken } from '../services/authService';

const experienceLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Expert', label: 'Expert' },
];

const projectDomains = [
  { value: 'Web Dev', label: 'Web Development' },
  { value: 'Mobile Dev', label: 'Mobile Development' },
  { value: 'AI/ML', label: 'Artificial Intelligence/Machine Learning' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Blockchain', label: 'Blockchain' },
];

const availabilityOptions = [
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Weekend only', label: 'Weekend only' },
];

const collaborationTypes = [
  { value: 'Remote', label: 'Remote' },
  { value: 'In-person', label: 'In-person' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const timeCommitments = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];

const initialSkillOptions = [
  { value: 'programming', label: 'Programming' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'ai_ml', label: 'AI/ML' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'content_writing', label: 'Content Writing' },
  { value: 'ui_ux', label: 'UI/UX Design' },
];

export const SignupContributor: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'signup' | 'profile'>('signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null as File | null,
  });
  const [profileData, setProfileData] = useState({
    name: '',
    skills: [] as any[],
    experienceLevel: null as any,
    preferredDomain: null as any,
    timeCommitmentValue: '',
    timeCommitmentUnit: null as any,
    hoursPerDay: '',
    availability: null as any,
    preferredCollaboration: null as any,
    linkedinUrl: '',
    githubUrl: '',
    motivation: '',
    resumeUrl: '',
  });
  const [skillOptions, setSkillOptions] = useState(initialSkillOptions);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    linkedinUrl: '',
    resumeUrl: '',
    profilePicture: '',
    hoursPerDay: '',
  });

  const handleSkillCreate = (inputValue: string) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setSkillOptions([...skillOptions, newOption]);
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, newOption]
    });
    return newOption;
  };

  const validateSignupForm = () => {
    let isValid = true;
    const newErrors = {
      ...errors,
      profilePicture: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.profilePicture) {
      newErrors.profilePicture = 'Profile picture is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateProfileForm = () => {
    let isValid = true;
    const newErrors = {
      ...errors,
      linkedinUrl: '',
      resumeUrl: '',
      hoursPerDay: '',
    };

    if (!profileData.name || !profileData.skills.length || !profileData.experienceLevel ||
      !profileData.preferredDomain || !profileData.timeCommitmentValue ||
      !profileData.timeCommitmentUnit || !profileData.availability ||
      !profileData.preferredCollaboration || !profileData.motivation ||
      !profileData.linkedinUrl || !profileData.resumeUrl || !profileData.hoursPerDay) {
      toast.error('Please fill in all required fields');
      isValid = false;
    }

    const linkedinRegex = /^https:\/\/[w]{0,3}\.?linkedin\.com\/.*$/;
    if (!profileData.linkedinUrl) {
      newErrors.linkedinUrl = 'LinkedIn profile URL is required';
      isValid = false;
    } else if (!linkedinRegex.test(profileData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
      isValid = false;
    }

    if (profileData.githubUrl) {
      const githubRegex = /^https:\/\/github\.com\/.*$/;
      if (!githubRegex.test(profileData.githubUrl)) {
        toast.error('Please enter a valid GitHub URL');
        isValid = false;
      }
    }

    const driveRegex = /^https:\/\/drive\.google\.com\/.*$/;
    if (!profileData.resumeUrl) {
      newErrors.resumeUrl = 'Resume Google Drive link is required';
      isValid = false;
    } else if (!driveRegex.test(profileData.resumeUrl)) {
      newErrors.resumeUrl = 'Please enter a valid Google Drive URL';
      isValid = false;
    }

    const hoursPerDay = parseInt(profileData.hoursPerDay);
    if (isNaN(hoursPerDay) || hoursPerDay < 1 || hoursPerDay > 24) {
      newErrors.hoursPerDay = 'Please enter a valid number of hours (1-24)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profilePicture: 'Profile picture must be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profilePicture: 'Please upload an image file' });
        return;
      }
      setFormData({ ...formData, profilePicture: file });
      setErrors({ ...errors, profilePicture: '' });
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Get only the base64 string
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignupForm()) {
      const { email, password, profilePicture } = formData;

      let base64ProfilePicture = '';
      if (profilePicture) {
        base64ProfilePicture = await convertFileToBase64(profilePicture);
      }

      const payload = {
        EmailAddress: email,
        Password: password,
        Role: 'Pcontributor',
        ProfilePicture: base64ProfilePicture,
      };

      try {
        const response = await fetch('http://localhost:5247/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.text();
          toast.error(error || 'Signup failed');
        } else {
          const data = await response.json();
          setCookie('auth', data.token, 7);
          toast.success('Signup successful! Let\'s complete your profile.');
          setStep('profile');
        }
      } catch (error) {
        console.error(error);
        alert('Signup failed. Please try again.');
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfileForm()) {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('auth='))?.split('=')[1];

        if (!token) {
          toast.error('Authentication token not found');
          return;
        }

        // Enhanced debugging logs
        console.log('Sending data:', {
          userId: getUserIdFromToken(),
          name: profileData.name,
          domain: profileData.preferredDomain?.label,
          timeUnit: profileData.timeCommitmentUnit?.value
        });

        // Fix data format to match exactly what the API expects
        const contributorData = {
          UserId: getUserIdFromToken(),
          FullName: profileData.name,
          PreferredProjectDomain: profileData.preferredDomain?.label || '',
          Skills: profileData.skills.map(skill => skill.label).join(', '),
          ExperienceLevel: profileData.experienceLevel?.value || '',
          TimeCommitmentValue: parseInt(profileData.timeCommitmentValue) || 0,
          TimeUnit: profileData.timeCommitmentUnit?.value || '',
          HoursPerDay: (profileData.hoursPerDay) || "0",
          Availability: profileData.availability?.value || '',
          PreferredCollabType: profileData.preferredCollaboration?.value || '',
          LinkedInProfileUrl: profileData.linkedinUrl || '',
          GitHubProfileUrl: profileData.githubUrl || '',
          ResumeGoogleDriveLink: profileData.resumeUrl || '',
          WhyContribute: profileData.motivation || ''
        };

        // Log the full payload for debugging
        console.log('Full contributor data being sent:', JSON.stringify(contributorData, null, 2));

        try {
          // Use XMLHttpRequest instead of fetch to bypass potential issues
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:5247/api/pcontributor', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.withCredentials = true;
          
          xhr.onload = function() {
            console.log('Response status:', xhr.status);
            
            if (xhr.status >= 200 && xhr.status < 300) {
              toast.success('Profile created successfully!');
              navigate('/dashboard/contributor');
            } else {
              console.error('Error response status:', xhr.status);
              
              if (xhr.status === 500) {
                console.error('Server error (500) occurred');
                try {
                  console.error('Server error details:', xhr.responseText);
                  toast.error('Server error: ' + (xhr.responseText.substring(0, 100) || 'Unknown error'));
                } catch (e) {
                  console.error('Could not read error details');
                  toast.error('Server error occurred. Please try again later.');
                }
              } else {
                try {
                  const contentType = xhr.getResponseHeader('content-type');
                  if (contentType && contentType.includes('application/json')) {
                    const errorData = JSON.parse(xhr.responseText);
                    console.error('API Error Response (JSON):', errorData);
                    
                    if (errorData.errors) {
                      const errorMessages = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                        .join('; ');
                      toast.error(`Validation errors: ${errorMessages}`);
                    } else {
                      toast.error(errorData.title || 'Failed to create contributor profile');
                    }
                  } else {
                    console.error('API Error Response (Text):', xhr.responseText);
                    toast.error(xhr.responseText || 'Failed to create contributor profile');
                  }
                } catch (parseError) {
                  console.error('Error parsing error response:', parseError);
                  toast.error('Failed to create profile. Please try again.');
                }
              }
            }
          };
          
          xhr.onerror = function() {
            console.error('Network error occurred');
            toast.error('Network error. Please check your connection and try again.');
          };
          
          xhr.send(JSON.stringify(contributorData));
        } catch (requestError) {
          console.error('Request error:', requestError);
          toast.error('Error sending request. Please try again.');
        }
      } catch (error) {
        console.error('Error creating contributor profile:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        toast.error('Failed to create profile. Please try again.');
      }
    }
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      background: 'transparent',
      borderColor: '#4B5563',
      '&:hover': {
        borderColor: '#60A5FA'
      }
    }),
    menu: (base: any) => ({
      ...base,
      background: '#1F2937',
      border: '1px solid #374151'
    }),
    option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#374151' : undefined,
      color: 'white',
      ':active': {
        backgroundColor: '#2563EB'
      }
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#3B82F6'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      ':hover': {
        backgroundColor: '#2563EB',
        color: 'white'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9CA3AF'
    })
  };

  const inputStyles = "mt-1 block w-full rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  if (step === 'signup') {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-blue-300 transition-colors hover:text-blue-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </button>

        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 shadow-xl backdrop-blur-lg">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                Create Contributor Account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Start your journey to find exciting projects to contribute to
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSignupSubmit}>
              <div className="space-y-4 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-white">Profile Picture *</label>
                  <div className="mt-1 flex items-center justify-center">
                    <div className="relative">
                      {formData.profilePicture ? (
                        <div className="relative h-32 w-32 overflow-hidden rounded-full">
                          <img
                            src={URL.createObjectURL(formData.profilePicture)}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, profilePicture: null })}
                            className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="absolute h-full w-full cursor-pointer opacity-0"
                          />
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.profilePicture && (
                    <p className="mt-1 text-center text-sm text-red-500">{errors.profilePicture}</p>
                  )}
                  <p className="mt-2 text-center text-sm text-gray-400">
                    Upload a profile picture (max 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Email address *</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputStyles} pl-10`}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Password *</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`${inputStyles} pl-10`}
                      placeholder="Create a password"
                      required
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">Confirm Password *</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`${inputStyles} pl-10`}
                      placeholder="Confirm your password"
                      required
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                Get Started
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/5 p-8 shadow-xl backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-white">Complete Your Contributor Profile</h2>
          <p className="mt-2 text-gray-400">Tell us more about yourself to find the perfect projects</p>

          <form onSubmit={handleProfileSubmit} className="mt-8 space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200">Full Name *</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Preferred Project Domain *</label>
                <Select
                  options={projectDomains}
                  value={profileData.preferredDomain}
                  onChange={(selected) => setProfileData({ ...profileData, preferredDomain: selected })}
                  styles={selectStyles}
                  className="mt-1"
                  placeholder="Select your preferred domain"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Choose the domain you are most proficient in
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Skills *</label>
                <CreatableSelect
                  isMulti
                  options={skillOptions}
                  value={profileData.skills}
                  onChange={(selected) => setProfileData({ ...profileData, skills: Array.from(selected) })}
                  onCreateOption={handleSkillCreate}
                  styles={selectStyles}
                  className="mt-1"
                  placeholder="Select or type your skills"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Can't find a skill? Just type it and press enter to add it
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Experience Level *</label>
                <Select
                  options={experienceLevels}
                  value={profileData.experienceLevel}
                  onChange={(selected) => setProfileData({ ...profileData, experienceLevel: selected })}
                  styles={selectStyles}
                  className="mt-1"
                  placeholder="Select experience level"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Time Commitment Value *</label>
                  <input
                    type="number"
                    min="1"
                    value={profileData.timeCommitmentValue}
                    onChange={(e) => setProfileData({ ...profileData, timeCommitmentValue: e.target.value })}
                    className={inputStyles}
                    placeholder="Enter time commitment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Time Unit *</label>
                  <Select
                    options={timeCommitments}
                    value={profileData.timeCommitmentUnit}
                    onChange={(selected) => setProfileData({ ...profileData, timeCommitmentUnit: selected })}
                    styles={selectStyles}
                    className="mt-1"
                    placeholder="Select time unit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Hours Per Day *</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={profileData.hoursPerDay}
                    onChange={(e) => setProfileData({ ...profileData, hoursPerDay: e.target.value })}
                    className={inputStyles}
                    placeholder="Hours available per day"
                    required
                  />
                  {errors.hoursPerDay && (
                    <p className="mt-1 text-sm text-red-500">{errors.hoursPerDay}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Availability *</label>
                <Select
                  options={availabilityOptions}
                  value={profileData.availability}
                  onChange={(selected) => setProfileData({ ...profileData, availability: selected })}
                  styles={selectStyles}
                  className="mt-1"
                  placeholder="Select availability"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Preferred Collaboration Type *</label>
                <Select
                  options={collaborationTypes}
                  value={profileData.preferredCollaboration}
                  onChange={(selected) => setProfileData({ ...profileData, preferredCollaboration: selected })}
                  styles={selectStyles}
                  className="mt-1"
                  placeholder="Select collaboration type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">LinkedIn Profile URL *</label>
                <input
                  type="url"
                  value={profileData.linkedinUrl}
                  onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/your-profile"
                  className={inputStyles}
                  required
                />
                {errors.linkedinUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.linkedinUrl}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profileData.githubUrl}
                  onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className={inputStyles}
                />
                <p className="mt-1 text-sm text-gray-400">Optional</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Resume Google Drive Link *</label>
                <input
                  type="url"
                  value={profileData.resumeUrl}
                  onChange={(e) => setProfileData({ ...profileData, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                  className={inputStyles}
                  required
                />
                {errors.resumeUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.resumeUrl}</p>
                )}
                <p className="mt-1 text-sm text-gray-400">Please provide a Google Drive link to your resume</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Why do you want to contribute? *</label>
                <textarea
                  value={profileData.motivation}
                  onChange={(e) => setProfileData({ ...profileData, motivation: e.target.value })}
                  rows={4}
                  className={inputStyles}
                  placeholder="Tell us about your motivation to contribute"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep('signup')}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:from-purple-600 hover:to-pink-600"
              >
                Complete Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};