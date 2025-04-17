
export interface User {
  id: string;
  profilePictureUrl: string;
  email: string;
  type: UserType;
}

export type UserType = 'project-owner' | 'contributor';

export interface Owner extends User {
  fullName: string;
  proTitle: string;
  proDes: string;
  reqProjectDomains: string[];
  reqSkills: string[];
  proType: string;
  collabMode: string;
  timeCommitValue: number;
  timeUnit: string;
  hoursPerDay: string;
  linkedInProfileUrl: string | undefined;
  githubProfileUrl: string | undefined;
  resumeGoogleDriveLink: string;
  compensationType: string;
  addReq: string;
}

export interface Contributor extends User {
  fullName: string;
  preferredProjectDomain: string;
  experienceLevel: string;
  skills: string[];
  availability: string;
  hoursPerDay: string;
  timeUnit: string;
  timeCommitmentValue: number;
  preferredCollabType: string;
  linkedInProfileUrl: string;
  gitHubProfileUrl: string;
  resumeGoogleDriveLink: string;
  whyContribute: string;
}