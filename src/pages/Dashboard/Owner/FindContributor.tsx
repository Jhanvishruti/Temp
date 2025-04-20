import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../../components/Button';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { ContributorProfile } from './ContributorProfile';
import { getUserIdFromToken } from '../../../services/authService';
import { Contributor as ContributorType } from '../../../types/index';

// Filter options
const availabilityOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'weekend-only', label: 'Weekend Only' }
];

const domainOptions = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'design', label: 'Design' },
    { value: 'blockchain', label: 'Blockchain' }
];

const experienceLevelOptions = [
    { value: 'junior', label: 'Junior' },
    { value: 'mid-level', label: 'Mid-Level' },
    { value: 'senior', label: 'Senior' }
];

const skillOptions = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'ui-ux', label: 'UI/UX Design' },
    { value: 'figma', label: 'Figma' }
];

interface Contributor extends ContributorType {
    userId: string;
}

// interface RequestNotification {
//     id: string;
//     contributorId: string;
//     profilePicture: string;
//     name: string;
//     email: string;
//     projectTitle: string;
//     status: 'pending' | 'accepted' | 'rejected';
//     createdAt: Date;
//     expiresAt: Date;
//     skills: string[];
//     experienceLevel: string;
//     preferredDomain: string;
//     availability: string;
//     preferredCollaboration: string;
//     hoursPerDay: string;
//     linkedinUrl: string;
//     githubUrl: string;
//     motivation: string;
// }

// Replace the static filter options with dynamic ones generated from the data

// Remove these static options
// const availabilityOptions = [...]
// const domainOptions = [...]
// const experienceLevelOptions = [...]
// const skillOptions = [...]

const FindContributors: React.FC = () => {
    // Add these new state variables for dynamic options
    const [availabilityOptions, setAvailabilityOptions] = useState<any[]>([]);
    const [domainOptions, setDomainOptions] = useState<any[]>([]);
    const [experienceLevelOptions, setExperienceLevelOptions] = useState<any[]>([]);
    const [skillOptions, setSkillOptions] = useState<any[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
    const [selectedDomain, setSelectedDomain] = useState<any>(null);
    const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<any>(null);
    const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedContributor, setSelectedContributor] = useState<any>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
    const [acceptedRequests, setAcceptedRequests] = useState<Set<string>>(new Set());

    // Move the generateFilterOptions function inside the component
    const generateFilterOptions = (contributors: Contributor[]) => {
        // Extract unique values for each filter
        const availabilities = new Set<string>();
        const domains = new Set<string>();
        const experienceLevels = new Set<string>();
        const skills = new Set<string>();
        
        contributors.forEach(contributor => {
            if (contributor.availability) {
                availabilities.add(contributor.availability.toLowerCase());
            }
            
            if (contributor.preferredProjectDomain) {
                domains.add(contributor.preferredProjectDomain.toLowerCase());
            }
            
            if (contributor.experienceLevel) {
                experienceLevels.add(contributor.experienceLevel.toLowerCase());
            }

            // Fix for the skills forEach error
            if (contributor.skills) {
                // Check if skills is an array
                if (Array.isArray(contributor.skills)) {
                    contributor.skills.forEach((skill: string) => {
                        if (skill) {
                            skills.add(skill.toLowerCase());
                        }
                    });
                } 
                // If skills is a string, split it and add each skill
                else if (typeof contributor.skills === 'string') {
                    const skillsString = contributor.skills as string;
                    skillsString.split(',')
                        .map((skill: string) => skill.trim())
                        .filter((skill: string) => skill !== '')
                        .forEach((skill: string) => {
                            skills.add(skill.toLowerCase());
                        });
                }
            }
        });
        
        // Convert sets to option arrays for react-select
        setAvailabilityOptions(Array.from(availabilities).map(availability => ({
            value: availability,
            label: availability.charAt(0).toUpperCase() + availability.slice(1) // Capitalize first letter
        })));
        
        setDomainOptions(Array.from(domains).map(domain => ({
            value: domain,
            label: domain.charAt(0).toUpperCase() + domain.slice(1)
        })));
        
        setExperienceLevelOptions(Array.from(experienceLevels).map(level => ({
            value: level,
            label: level.charAt(0).toUpperCase() + level.slice(1)
        })));
        
        setSkillOptions(Array.from(skills).map(skill => ({
            value: skill,
            label: skill.charAt(0).toUpperCase() + skill.slice(1)
        })));
    };

    // Fetch contributors from the backend API
    useEffect(() => {
        const fetchContributors = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5247/api/pcontributor');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                var data = await response.json();
                
                // Map the backend data to match our frontend structure if needed
                const mappedContributors = data.map((contributor: Contributor) => ({
                    userId: contributor.userId,
                    id: contributor.id,
                    // Handle Base64 profile picture correctly
                    profilePictureUrl: contributor.profilePictureUrl 
                        ? contributor.profilePictureUrl.startsWith('data:') 
                            ? contributor.profilePictureUrl 
                            : `data:image/jpeg;base64,${contributor.profilePictureUrl}`
                        : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', // Default image if none provided
                    fullName: contributor.fullName,
                    skills: contributor.skills ? contributor.skills : [],
                    experienceLevel: contributor.experienceLevel,
                    preferredProjectDomain: contributor.preferredProjectDomain,
                    availability: contributor.availability,
                    preferredCollaboration: contributor.preferredCollabType,
                    hoursPerDay: contributor.hoursPerDay,
                    linkedinUrl: contributor.linkedInProfileUrl,
                    githubUrl: contributor.gitHubProfileUrl,
                    resumeUrl: contributor.resumeGoogleDriveLink,
                    motivation: contributor.whyContribute
                }));
                console.log(mappedContributors);
                setContributors(mappedContributors);
                
                // Generate dynamic filter options from the data
                generateFilterOptions(mappedContributors);
                
                setError(null);
            } catch (err) {
                console.error('Error fetching contributors:', err);
                setError('Failed to load contributors. Please try again later.');
                toast.error('Failed to load contributors');
            } finally {
                setLoading(false);
            }
        };

        const fetchPendingRequests = async () => {
            try {
                var uid = getUserIdFromToken();
                const response = await fetch(`http://localhost:5247/api/request/sent/${uid}`);
                const data = await response.json()
                const pendingRequestIds = data.map((request: any) => request.receiverId);
                // console.log(pendingRequestIds)
                setPendingRequests(new Set(pendingRequestIds));
            } catch (err) {
                console.error('Error fetching pending requests:', err);
                toast.error('Failed to load pending requests');
            }
        };

        fetchContributors();
        fetchPendingRequests();
    }, []);

    const selectStyles = {
        control: (base: any) => ({
            ...base,
            background: 'transparent',
            borderColor: '#4B5563',
            '&:hover': { borderColor: '#60A5FA' }
        }),
        menu: (base: any) => ({
            ...base,
            background: '#1F2937',
            border: '1px solid #374151'
        }),
        option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#374151' : undefined,
            color: 'white'
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
        singleValue: (base: any) => ({
            ...base,
            color: 'white'
        }),
        input: (base: any) => ({
            ...base,
            color: 'white'
        })
    };
    const handleProfileClick = (contributor: any) => {
        setSelectedContributor(contributor);
        setShowProfile(true);
    };

    const handleSendRequest = (contributor: Contributor) => {
        if (pendingRequests.has(contributor.id)) {
            toast.error('Request already sent to this contributor');
            return;
        }
        setSelectedContributor(contributor);
        setShowConfirmDialog(true);
    };

    const confirmRequest = async () => {
        if (!selectedContributor) return;
        
        try {
            // Fix: Convert userId to string since the API expects string IDs
            const requestData = {
                senderId: getUserIdFromToken().toString(), // Convert number to string
                receiverId: selectedContributor.userId, // Keep as string
                senderRole: "Powner"
            };
            
            console.log("Sending request data:", requestData);
            
            // Send request to the API
            const response = await fetch('http://localhost:5247/api/request/send', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
    
            if(!response.ok){
                const errorData = await response.json().catch(() => null);
                console.error('API error response:', errorData);
                throw new Error('Failed to send request');
            }
            
            // Update UI state
            setPendingRequests(prev => new Set([...prev, selectedContributor.id]));
            toast.success(`Request sent to ${selectedContributor.fullName}`);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Failed to send request. Please try again.');
        }
    };

    // Update the filteredContributors function to handle undefined values
    const filteredContributors = contributors.filter((contributor) => {
        const matchesSearch = searchQuery === '' ||
            (contributor.fullName && contributor.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (contributor.experienceLevel && contributor.experienceLevel.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (contributor.skills && (
                Array.isArray(contributor.skills) 
                    ? contributor.skills.some(skill => skill && skill.toLowerCase().includes(searchQuery.toLowerCase()))
                    : typeof contributor.skills === 'string'
                        ? (contributor.skills as string).toLowerCase().includes(searchQuery.toLowerCase())
                        : false
            ));
    
        const matchesAvailability = !selectedAvailability ||
            (contributor.availability && contributor.availability.toLowerCase() === selectedAvailability.value);
    
        const matchesDomain = !selectedDomain ||
            (contributor.preferredProjectDomain && contributor.preferredProjectDomain.toLowerCase().includes(selectedDomain.value));
    
        const matchesExperience = !selectedExperienceLevel ||
            (contributor.experienceLevel && contributor.experienceLevel.toLowerCase() === selectedExperienceLevel.value);
    
        const matchesSkills = selectedSkills.length === 0 ||
            selectedSkills.every(selected => {
                if (!contributor.skills) return false;
                
                if (Array.isArray(contributor.skills)) {
                    return contributor.skills.some(skill => 
                        skill && skill.toLowerCase().includes(selected.value)
                    );
                } else if (typeof contributor.skills === 'string') {
                    return (contributor.skills as string).toLowerCase().includes(selected.value);
                }
                
                return false;
            });
    
        return matchesSearch && matchesAvailability && matchesDomain &&
            matchesExperience && matchesSkills;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search contributors by name, skills, or experience..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-600 bg-black/20 px-10 py-2 text-white placeholder-gray-400"
                    />
                </div>
                <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="h-5 w-5" />
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="grid gap-4 rounded-lg border border-gray-700 bg-black/20 p-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">Availability</label>
                        <Select
                            options={availabilityOptions}
                            value={selectedAvailability}
                            onChange={setSelectedAvailability}
                            styles={selectStyles}
                            placeholder="Select availability"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">Domain</label>
                        <Select
                            options={domainOptions}
                            value={selectedDomain}
                            onChange={setSelectedDomain}
                            styles={selectStyles}
                            placeholder="Select domain"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">Experience Level</label>
                        <Select
                            options={experienceLevelOptions}
                            value={selectedExperienceLevel}
                            onChange={setSelectedExperienceLevel}
                            styles={selectStyles}
                            placeholder="Select experience level"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-200">Skills</label>
                        <Select
                            isMulti
                            options={skillOptions}
                            value={selectedSkills}
                            onChange={(newValue) => setSelectedSkills([...newValue])}
                            styles={selectStyles}
                            placeholder="Select required skills"
                        />
                    </div>
                </div>
            )}

<div className="space-y-4">
                {loading ? (
                    <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
                        <p className="text-center text-gray-400">Loading contributors...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
                        <p className="text-center text-red-400">{error}</p>
                        <Button 
                            className="mx-auto mt-2 block"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                ) : filteredContributors.length > 0 ? (
                    filteredContributors.map((contributor) => (
                        <div 
                            key={contributor.id} 
                            className="rounded-lg border border-gray-700 bg-black/20 p-4 cursor-pointer hover:bg-black/30 transition-colors"
                            onClick={() => handleProfileClick(contributor)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={contributor.profilePictureUrl}
                                        alt={contributor.fullName}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium text-white">{contributor.fullName}</h3>
                                        <p className="text-sm text-gray-400">
                                            {contributor.experienceLevel} • {contributor.availability} • {contributor.preferredProjectDomain}
                                        </p>
                                    </div>
                                </div>
                                {acceptedRequests.has(contributor.id) ? (
                                    <span className="text-green-400">Collaborating</span>
                                ) : pendingRequests.has(contributor.id) ? (
                                    <span className="text-yellow-400">Request Pending</span>
                                ) : (
                                    <Button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSendRequest(contributor);
                                        }}
                                    >
                                        Send Request
                                    </Button>
                                )}
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(contributor.skills) 
                                        ? contributor.skills.map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                        : typeof contributor.skills === 'string' 
                                            ? (contributor.skills as string).split(',')
                                                .map((skill: string, index: number) => skill.trim())
                                                .filter(Boolean)
                                                .map((skill: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
                        <p className="text-center text-gray-400">No contributors found matching your criteria</p>
                    </div>
                )}
            </div>
            
            {showProfile && selectedContributor && (
                <ContributorProfile
                    contributor={selectedContributor}
                    onClose={() => setShowProfile(false)}
                />
            )}

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={confirmRequest}
                title="Send Request"
                message={`Are you sure you want to send a request to ${selectedContributor?.name}?`}
            />
        </div>
    );
};

export default FindContributors;