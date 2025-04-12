import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../components/Button';
import Select from 'react-select';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';
import { ContributorProfile } from '../ContributorProfile';
import axios from 'axios';
import { getUserIdFromToken } from '../../services/authService';

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

interface Contributor {
    id: string;
    profilePicture: string;
    name: string;
    email: string;
    skills: string[];
    experienceLevel: string;
    preferredDomain: string;
    availability: string;
    preferredCollaboration: string;
    hoursPerDay: string;
    linkedinUrl: string;
    githubUrl: string;
    motivation: string;
    resumeUrl: string;
}

interface RequestNotification {
    id: string;
    contributorId: string;
    profilePicture: string;
    name: string;
    email: string;
    projectTitle: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    expiresAt: Date;
    skills: string[];
    experienceLevel: string;
    preferredDomain: string;
    availability: string;
    preferredCollaboration: string;
    hoursPerDay: string;
    linkedinUrl: string;
    githubUrl: string;
    motivation: string;
}

const FindContributors: React.FC = () => {
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

    // Fetch contributors from the backend API
    useEffect(() => {
        const fetchContributors = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5247/api/pcontributor');
                
                // Map the backend data to match our frontend structure if needed
                const mappedContributors = response.data.map((contributor: any) => ({
                    id: contributor.userId,
                    profilePicture: contributor.profilePicture || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', // Default image if none provided
                    name: contributor.name,
                    email: contributor.email,
                    skills: contributor.skills ? contributor.skills.split(',') : [],
                    experienceLevel: contributor.experienceLevel,
                    preferredDomain: contributor.preferredDomain,
                    availability: contributor.availability,
                    preferredCollaboration: contributor.preferredCollaboration,
                    hoursPerDay: contributor.hoursPerDay,
                    linkedinUrl: contributor.linkedinUrl,
                    githubUrl: contributor.githubUrl,
                    motivation: contributor.motivation,
                    resumeUrl: contributor.resumeUrl
                }));
                
                setContributors(mappedContributors);
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
                const response = await axios.get(`http://localhost:5247/api/request/sent/${uid}`);
                const pendingRequestIds = response.data.map((request: any) => request.receiverId);
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
            // Send request to the API
            await axios.post('http://localhost:5247/api/request/send', {
                senderId: getUserIdFromToken(), 
                receiverId: selectedContributor.id,
                senderRole: 'powner'
            });
    
            // Update UI state
            setPendingRequests(prev => new Set([...prev, selectedContributor.id]));
            toast.success(`Request sent to ${selectedContributor.name}`);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Failed to send request. Please try again.');
        }
    };
    
    

    const filteredContributors = contributors.filter((contributor) => {
        const matchesSearch = searchQuery === '' ||
            contributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contributor.experienceLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contributor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesAvailability = !selectedAvailability ||
            contributor.availability.toLowerCase() === selectedAvailability.value;

        const matchesDomain = !selectedDomain ||
            contributor.preferredDomain.toLowerCase().includes(selectedDomain.value);

        const matchesExperience = !selectedExperienceLevel ||
            contributor.experienceLevel.toLowerCase() === selectedExperienceLevel.value;

        const matchesSkills = selectedSkills.length === 0 ||
            selectedSkills.every(selected =>
                contributor.skills.some(skill =>
                    skill.toLowerCase().includes(selected.value)
                )
            );

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
                                        src={contributor.profilePicture}
                                        alt={contributor.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium text-white">{contributor.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            {contributor.experienceLevel} • {contributor.availability} • {contributor.preferredDomain}
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