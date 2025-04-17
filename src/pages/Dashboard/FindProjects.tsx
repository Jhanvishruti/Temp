import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../components/Button';
import { toast } from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog' ;
import { ProjectOwnerProfile } from './ProjectOwnerProfile';
import { User } from '../../types';
import { getUserIdFromToken } from '../../services/authService';

interface ProjectOwnerProfile extends User {
  proTitle: string;
  proDes: string;
  reqProjectDomain: string;
  reqSkills: string;
  proType: string;
  collabMode: string;
  timeNeedValue: number;
  timeUnit: string;
  hoursPerDay: string;
  linkedInProfileUrl: string;
  gitHubProfileUrl: string;
  resumeGoogleDriveLink: string;
  compensationType: string;
  addReq: string;
}

interface ProjectDisplay extends ProjectOwnerProfile {
  title: any;
  description: any;
  fullName: string;
  userId: any;
  projectTitle: string;
  projectDescription: string;
  domain: string;
  projectType: string;
  requiredSkills: string[];
  timeRequired: string;
  additionalRequirements: string;
}


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
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDisplay | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState<RequestStatus[]>([]);
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
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
        const data: ProjectOwnerProfile[] = await response.json();
        
        // Transform Powner data to ProjectDisplay format with all required properties
        const transformedProjects: ProjectDisplay[] = data.map(project => ({
          ...project,
          fullName: project.name || '',  // Ensure fullName is set
          userId: project.id,            // Set userId to the project's id
          projectId: project.id,
          projectTitle: project.proTitle,
          projectDescription: project.proDes,
          // Add the missing title and description properties
          title: project.proTitle,       // Set title to match projectTitle
          description: project.proDes,   // Set description to match projectDescription
          domain: project.reqProjectDomain,
          projectType: project.proType,
          requiredSkills: project.reqSkills ? project.reqSkills.split(',').map((skill: string) => skill.trim()) : [],
          timeRequired: `${project.timeNeedValue} ${project.timeUnit}`,
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
  const generateFilterOptions = (projects: ProjectDisplay[]) => {
    // Extract unique domains
    const domains = new Set<string>();
    // Extract unique project types
    const types = new Set<string>();
    // Extract unique skills
    const skills = new Set<string>();
    
    projects.forEach(project => {
      // Add domain if it exists
      if (project.domain) {
        domains.add(project.domain.toLowerCase());
      }
      
      // Add project type if it exists
      if (project.projectType) {
        types.add(project.projectType.toLowerCase());
      }
      
      // Add all skills
      project.requiredSkills.forEach(skill => {
        if (skill) {
          skills.add(skill.toLowerCase());
        }
      });
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
  
  const handleSendRequest = (project: ProjectDisplay) => {
    if (pendingRequests.has(project.id)) {
      toast.error('Request already sent to this project');
      return;
    }
    setSelectedProject(project);
    setShowConfirmDialog(true);
  };
  
  const confirmRequest = async () => {
    if (!selectedProject) return;
    
    // Use userId instead of id for the receiverId
    const requestData = {
      senderId: (getUserIdFromToken()),
      receiverId: parseInt(selectedProject.userId.toString()), // Use userId instead of id
      senderRole: 'contributor'
    };
    
    console.log("Sending request with data:", requestData);
    
    if (isNaN(requestData.receiverId)) {
      toast.error('Invalid project owner ID');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5247/api/request/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const responseText = await response.text();
      console.log("Server response:", responseText);
      
      if (!response.ok) {
        // Handle specific error cases
        if (responseText.includes("Request already sent")) {
          toast.success("You've already sent a request to this project owner", {
            icon: 'ℹ️',
          });
          setShowConfirmDialog(false);
          return;
        } else if (responseText.includes("Collaboration already exists")) {
          toast.success("You're already collaborating on this project", {
            icon: 'ℹ️',
          });
          setShowConfirmDialog(false);
          // Here we could redirect to collaborations page if needed
          return;
        }
        throw new Error('Failed to send request');
      }
  
      setPendingRequests(prev => new Set([...prev, selectedProject.userId.toString()]));
      toast.success(`Request sent to ${selectedProject.fullName || selectedProject.name}`);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request. Please try again.');
    }
  };

  const getRequestStatus = (projectId: string) => {
    return requestStatuses.find(req => req.projectId === projectId);
  };

  // Update the search functionality to include domain and skills
  // Add null checks to the filter function in FindProjects.tsx
  // This is around line 355-365 based on the error
  
  // Add the missing state variable
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<any>(null);
  
  // OR modify the filteredProjects function to remove the reference
  
  const filteredProjects = projects.filter((project) => {
  const matchesSearch = searchQuery === '' ||
      (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.domain && project.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.requiredSkills && project.requiredSkills.some(skill => 
          skill && skill.toLowerCase().includes(searchQuery.toLowerCase())
      ));
  
  const matchesDomain = !selectedDomain ||
      (project.domain && project.domain.toLowerCase() === selectedDomain.value);
  
  // Remove this condition since selectedExperienceLevel is not defined
  // const matchesExperience = !selectedExperienceLevel ||
  //     (project.experienceLevel && project.experienceLevel.toLowerCase() === selectedExperienceLevel.value);
  
  const matchesType = !selectedType ||
      (project.projectType && project.projectType.toLowerCase() === selectedType.value);
  
  const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.every(selected =>
          project.requiredSkills && project.requiredSkills.some(skill =>
              skill && skill.toLowerCase().includes(selected.value)
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
            <label className="mb-2 block text-sm font-medium text-gray-200">Project Type</label>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              styles={selectStyles}
              placeholder="Select type"
              isClearable
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-200">Required Skills</label>
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
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const status = getRequestStatus(project.id);
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
                      alt={project.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white">{project.projectTitle}</h3>
                      <p className="text-sm text-gray-400">
                        {project.domain} • {project.projectType} • by {project.name}
                      </p>
                    </div>
                  </div>
                  {status?.status === 'accepted' ? (
                    <span className="text-green-400">Request Accepted</span>
                  ) : status?.status === 'rejected' ? (
                    <span className="text-red-400">Request Rejected</span>
                  ) : status?.status === 'pending' ? (
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
          onSendRequest={(e) => {
            e.stopPropagation();
            handleSendRequest(selectedProject);
          }}
          isPending={getRequestStatus(selectedProject.id)?.status === 'pending'}
          isAccepted={getRequestStatus(selectedProject.id)?.status === 'accepted'}
          isRejected={getRequestStatus(selectedProject.id)?.status === 'rejected'}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmRequest}
        title="Send Request"
        message={`Are you sure you want to send a request to join "${selectedProject?.projectTitle}"?`}
      />
    </div>
  );
};

export default FindProjects;