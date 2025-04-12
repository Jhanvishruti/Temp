
export interface User {
  id: string;
  profilePictureUrl: string;
  name: string;
  email: string;
  type: UserType;
}

export type UserType = 'project-owner' | 'contributor';

export interface ProjectOwnerProfile extends User {
  projectDescription: ReactNode;
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

export interface ContributorProfile extends User {
  preferredProjectDomain: string;
  skills: string;
  experienceLevel: string;
  timeCommitmentValue: number;
  time: string;
  hoursPerDay: string;
  availability: string;
  preferredCollabType: string;
  linkedInProfileUrl: string;
  gitHubProfileUrl: string;
  resumeGoogleDriveLink: string;
  whyContribute: string;
}