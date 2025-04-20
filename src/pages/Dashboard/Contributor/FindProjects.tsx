import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../../components/Button';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { ProjectOwnerProfile } from './ProjectOwnerProfile';
import { getUserIdFromToken } from '../../../services/authService';
import { Owner } from '../../../types';
// Remove the unused import
// import { SearchBar } from '../../../components/SearchBar';

interface OwnerProfile extends Owner {
  userId: any;
}

// interface ProjectDisplay {
//   userId: string;
//   title: string;
//   description: string;
//   fullName: string;
//   projectTitle: string;
//   projectDescription: string;
//   domain: string;
//   projectType: string;
//   requiredSkills: string[];
//   timeRequired: string;
//   additionalRequirements: string;
// }


// Mock data with expanded project owner details
// const mockProjects = [
//   {
//     id: '1',
//     projectTitle: 'AI Chatbot for Customer Support',
//     projectDescription: 'An AI-powered chatbot that revolutionizes customer support by automating responses and learning from interactions. Looking for ML engineers and NLP specialists.',
//     domain: 'AI/ML',
//     projectType: 'Startup',
//     requiredSkills: ['Python', 'NLP', 'TensorFlow', 'API Development'],
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     type: 'project-owner',
//     profilePictureurl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
//     collaborationMode: 'Remote',
//     timeRequired: '6 months',
//     hoursPerDay: 6,
//     compensationType: 'Equity-based',
//     additionalRequirements: 'Experience with machine learning and natural language processing is required.'
//   },
//   {
//     id: '2',
//     projectTitle: 'Decentralized Voting System',
//     projectDescription: 'A blockchain-based voting platform ensuring secure and transparent elections.',
//     domain: 'Blockchain',
//     projectType: 'Open Source',
//     requiredSkills: ['Solidity', 'Ethereum', 'React', 'Smart Contracts'],
//     name: 'Bob Smith',
//     email: 'bob@example.com',
//     type: 'project-owner',
//     profilePictureurl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
//     collaborationMode: 'Hybrid',
//     timeRequired: '3-4 months',
//     hoursPerDay: 4,
//     compensationType: 'Paid',
//     additionalRequirements: 'Looking for developers with blockchain experience and a passion for decentralization.'
//   }
// ];

const projectOptions = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'ai', label: 'AI/ML' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'design', label: 'Design' }
];

const typeOptions = [
  { value: 'startup', label: 'Startup' },
  { value: 'opensource', label: 'Open Source' },
  { value: 'personal', label: 'Personal' },
  { value: 'enterprise', label: 'Enterprise' }
];

const skillOptions = [
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'design', label: 'UI/UX Design' }
];

interface RequestStatus {
  projectId: string;
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: Date;
}

const FindProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OwnerProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState<RequestStatus[]>([]);
  const [projects, setProjects] = useState<OwnerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for dynamic filter options
  const [domainOptions, setDomainOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5247/api/powner');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: OwnerProfile[] = await response.json();

        // Transform Powner data to ProjectDisplay format with all required properties
        const transformedProjects: OwnerProfile[] = data.map(project => ({
          ...project,
          fullName: project.fullName || '',  // Ensure fullName is set
          userId: project.userId,            // Set userId to the project's id
          // Handle Base64 profile picture correctly
          profilePictureUrl: project.profilePictureUrl 
            ? project.profilePictureUrl.startsWith('data:') 
              ? project.profilePictureUrl 
              : `data:image/jpeg;base64,${project.profilePictureUrl}`
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', // Default image only if none provided
          projectTitle: project.proTitle,
          projectDescription: project.proDes,
          title: project.proTitle,       // Set title to match projectTitle
          description: project.proDes,   // Set description to match projectDescription
          domain: project.reqProjectDomains,
          projectType: project.proType,
          requiredSkills: project.reqSkills ? project.reqSkills : [],
          timeRequired: `${project.timeCommitValue} ${project.timeUnit}`,
          additionalRequirements: project.addReq || ''
        }));
        setProjects(transformedProjects);

        // Generate dynamic filter options from the fetched projects
        generateFilterOptions(transformedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to generate filter options from projects
  const generateFilterOptions = (projects: OwnerProfile[]) => {
    // Extract unique domains
    const domains = new Set<string>();
    // Extract unique project types
    const types = new Set<string>();
    // Extract unique skills
    const skills = new Set<string>();

    projects.forEach(project => {
      // Add domain if it exists
      if (Array.isArray(project.reqProjectDomains)) {
        project.reqProjectDomains.forEach((domain: string) => domains.add(domain.toLowerCase()));
      }

      // Add project type if it exists
      if (project.proType) {
        types.add(project.proType.toLowerCase());
      }

      // Add all skills
      if (Array.isArray(project.reqSkills)) {
        project.reqSkills.forEach(skill => {
          if (skill) {
            skills.add(skill.toLowerCase());
          }
        });
      }
    });

    // Convert sets to option arrays for react-select
    setDomainOptions(Array.from(domains).map(domain => ({
      value: domain,
      label: domain.charAt(0).toUpperCase() + domain.slice(1) // Capitalize first letter
    })));

    setTypeOptions(Array.from(types).map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1) // Capitalize first letter
    })));

    setSkillOptions(Array.from(skills).map(skill => ({
      value: skill,
      label: skill.charAt(0).toUpperCase() + skill.slice(1) // Capitalize first letter
    })));
  };

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

  const handleProfileClick = (project: any) => {
    setSelectedProject(project);
    setShowProfile(true);
  };

  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPendingRequests = async () => {
      var a = getUserIdFromToken()
      console.log(a)
      try {
        const response = await fetch(`http://localhost:5247/api/request/sent/${a}`);
        if (response.ok) {
          const data = await response.json();
          const pendingRequestIds = data.map((request: any) => request.receiverId);
          setPendingRequests(new Set(pendingRequestIds));
        } else {
          throw new Error('Failed to fetch pending requests');
        }
      } catch (err) {
        console.error('Error fetching pending requests:', err);
        toast.error('Failed to load pending requests');
      }
    };

    fetchPendingRequests();
  }, []);

  const handleSendRequest = (project: OwnerProfile) => {
    if (pendingRequests.has(project.userId)) {
      toast.error('Request already sent to this project');
      return;
    }
    setPendingRequests(prev => new Set([...prev, project.userId.toString()]));
    setSelectedProject(project);
    setShowConfirmDialog(true);
  };

  const confirmRequest = async () => {
    if (!selectedProject) return;
    const requestData = {
      senderId: (getUserIdFromToken()),
      receiverId: selectedProject.userId,
      senderRole: 'contributor'
    };
    // console.log("Sending request with data:", requestData);

    try {
      const response = await fetch('http://localhost:5247/api/request/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const responseText = await response.text();
      if (!response.ok) {
        // Handle specific error cases
        if (responseText.includes("Request already sent") || responseText.includes("Collaboration already exists")) {
          toast.success("You've already sent a request to this project owner", {
            icon: 'ℹ️',
          });
          setShowConfirmDialog(false);
          return;
        }
        throw new Error('Failed to send request');
      }

      setPendingRequests(prev => new Set([...prev, selectedProject.userId.toString()]));
      toast.success(`Request sent to ${selectedProject.fullName || selectedProject.fullName}`);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request. Please try again.');
    }
  };

  const getRequestStatus = (projectId: string) => {
    return requestStatuses.find(req => req.projectId === projectId);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      (project.proTitle && project.proTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.proDes && project.proDes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(project.reqProjectDomains) &&
        project.reqProjectDomains.some(
          (domain) => domain && domain.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
      (Array.isArray(project.reqSkills) &&
        project.reqSkills.some(
          (skill) => skill && skill.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesDomain = selectedDomains.length === 0 ||
      selectedDomains.every((selected) =>
        Array.isArray(project.reqProjectDomains) &&
        project.reqProjectDomains.some(
          (domain) => domain && domain.toLowerCase().includes(selected)
        )
      );

    const matchesType = !selectedType ||
      (project.proType && project.proType.toLowerCase() === selectedType.value);

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.every((selected) =>
        Array.isArray(project.reqSkills) &&
        project.reqSkills.some(
          (skill) => skill && skill.toLowerCase().includes(selected)
        )
      );

    // Remove matchesExperience from the return statement
    return matchesSearch && matchesDomain && matchesType && matchesSkills;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading projects...</div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-black/20 px-10 py-2 text-white placeholder-gray-400"
          />
        </div>
        <Button variant="secondary" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-5 w-5" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 rounded-lg border border-gray-700 bg-black/20 p-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">Project Domain</label>
            <Select
              isMulti
              options={domainOptions}
              value={domainOptions.filter(option => selectedDomains.includes(option.value))}
              onChange={(selected) => {
                setSelectedDomains(selected ? selected.map(item => item.value) : []);
              }}
              styles={selectStyles}
              placeholder="Select domain"
              isClearable
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-200">Required Skills</label>
            <Select
              isMulti
              options={skillOptions}
              value={skillOptions.filter(option => selectedSkills.includes(option.value))}
              onChange={(selected) => {
                setSelectedSkills(selected ? selected.map(item => item.value) : []);
              }}
              styles={selectStyles}
              placeholder="Select required skills"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const status = getRequestStatus(project.id);
            const isPending = pendingRequests.has(project.id);
            
            return (
              <div
                key={project.id}
                className="rounded-lg border border-gray-700 bg-black/20 p-4 cursor-pointer hover:bg-black/30 transition-colors"
                onClick={() => handleProfileClick(project)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={project.profilePictureUrl}
                      alt={project.fullName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white">{project.proTitle}</h3>
                      <p className="text-sm text-gray-400">
                        {project.reqProjectDomains} • {project.proType} • by {project.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.collabMode || 'Remote'} • {project.timeCommitValue || 'Flexible'}
                      </p>
                    </div>
                  </div>
                  {status?.status === 'accepted' ? (
                    <span className="text-green-400">Request Accepted</span>
                  ) : status?.status === 'rejected' ? (
                    <span className="text-red-400">Request Rejected</span>
                  ) : isPending ? (
                    <span className="text-yellow-400">Request Pending</span>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendRequest(project);
                      }}
                    >
                      Send Request
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
            <p className="text-center text-gray-400">No projects found matching your criteria</p>
          </div>
        )}
      </div>

      {showProfile && selectedProject && (
        <ProjectOwnerProfile
          owner={selectedProject}
          onClose={() => setShowProfile(false)}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRequest}
        title="Send Request"
        message={`Are you sure you want to send a request to join "${selectedProject?.proTitle}"?`}
      />
    </div>
  );
};

export default FindProjects;