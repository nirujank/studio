
export type StaffMember = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  jobTitle: string;
  category: 'Engineering' | 'Design' | 'Product' | 'PCO' | 'Marketing';
  jobCategory: 'Intern' | 'Casual' | 'Permanent' | 'On Contract';
  employmentType: 'Full-time' | 'Part-time';
  region: 'NA' | 'EMEA' | 'APAC' | 'LATAM' | 'Central' | 'Eastern';
  country: string;
  homeOffice: string;
  contractualOffice: string;
  tenantId: string;
  tenantName: string;
  status: 'Active' | 'Deactivated';
  profile: {
    personal: {
      phone: string;
      address: string;
      dob: string;
      emergencyContact: string;
      contactPriority: string;
      specialNeeds: string;
    };
    education: {
      degree: string;
      university: string;
      year: number;
    }[];
    skills: string[];
    courses: string[];
    hobbies: string[];
    volunteering: string[];
    resumeUris: string[];
    certificateUris: string[];
  };
  jobHistory: {
    position: string;
    company: string;
    startDate: string;
    endDate: string | null;
    salary: number;
  }[];
  leave: {
    sick: {
      entitled: number;
      taken: number;
    };
    vacation: {
      entitled: number;
      taken: number;
    };
    personal: {
      entitled: number;
      taken: number;
    };
  };
};

export const staffData: StaffMember[] = [
  {
    id: 'USR-001',
    name: 'Alex Johnson',
    email: 'alex.j@invorg.com',
    avatar: 'https://picsum.photos/seed/101/200/200',
    jobTitle: 'Senior Software Engineer',
    category: 'Engineering',
    jobCategory: 'Permanent',
    employmentType: 'Full-time',
    region: 'NA',
    country: 'USA',
    homeOffice: 'San Francisco, CA',
    contractualOffice: 'San Francisco, CA',
    tenantId: 'TEN-001',
    tenantName: 'Innovate Corp',
    status: 'Active',
    profile: {
      personal: {
        phone: '123-456-7890',
        address: '123 Tech Ave, Silicon Valley, CA',
        dob: '1990-05-15',
        emergencyContact: 'Jane Doe (Spouse) - 111-222-3333',
        contactPriority: 'High',
        specialNeeds: 'None',
      },
      education: [
        {
          degree: 'M.S. in Computer Science',
          university: 'Stanford University',
          year: 2014,
        },
        {
          degree: 'B.S. in Computer Science',
          university: 'University of California, Berkeley',
          year: 2012,
        },
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS', 'Docker'],
      courses: ['Advanced GraphQL', 'AWS Certified Developer'],
      hobbies: ['Hiking', 'Photography', 'Playing Guitar'],
      volunteering: ['Code for America', 'Local Food Bank'],
      resumeUris: [],
      certificateUris: [],
    },
    jobHistory: [
      {
        position: 'Senior Software Engineer',
        company: 'Invorg',
        startDate: '2020-01-10',
        endDate: null,
        salary: 150000,
      },
      {
        position: 'Software Engineer',
        company: 'TechCorp',
        startDate: '2016-06-01',
        endDate: '2019-12-20',
        salary: 110000,
      },
       {
        position: 'Junior Developer',
        company: 'StartUp Inc.',
        startDate: '2014-07-15',
        endDate: '2016-05-30',
        salary: 80000,
      },
    ],
    leave: {
        sick: { entitled: 10, taken: 2 },
        vacation: { entitled: 20, taken: 5 },
        personal: { entitled: 5, taken: 1 },
    }
  },
  {
    id: 'USR-002',
    name: 'Maria Garcia',
    email: 'maria.g@invorg.com',
    avatar: 'https://picsum.photos/seed/102/200/200',
    jobTitle: 'Lead Product Designer',
    category: 'Design',
    jobCategory: 'Permanent',
    employmentType: 'Full-time',
    region: 'EMEA',
    country: 'United Kingdom',
    homeOffice: 'London, UK',
    contractualOffice: 'London, UK',
    tenantId: 'TEN-002',
    tenantName: 'Global Solutions',
    status: 'Active',
    profile: {
      personal: {
        phone: '+44 20 7946 0958',
        address: '45 Creative St, London, UK',
        dob: '1992-08-22',
        emergencyContact: 'Luis Garcia (Brother) - +44 20 7946 0959',
        contactPriority: 'Medium',
        specialNeeds: 'None',
      },
      education: [
        {
          degree: 'M.A. in Interaction Design',
          university: 'Royal College of Art',
          year: 2016,
        },
      ],
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
      courses: ['Advanced Figma Techniques'],
      hobbies: ['Painting', 'Yoga'],
      volunteering: ['Design for Good'],
      resumeUris: [],
      certificateUris: [],
    },
    jobHistory: [
      {
        position: 'Lead Product Designer',
        company: 'Invorg',
        startDate: '2021-03-15',
        endDate: null,
        salary: 120000,
      },
       {
        position: 'UX/UI Designer',
        company: 'Innovate Ltd.',
        startDate: '2017-01-20',
        endDate: '2021-03-01',
        salary: 90000,
      },
    ],
    leave: {
        sick: { entitled: 10, taken: 0 },
        vacation: { entitled: 25, taken: 10 },
        personal: { entitled: 5, taken: 2 },
    }
  },
  {
    id: 'USR-003',
    name: 'Chen Wei',
    email: 'chen.w@invorg.com',
    avatar: 'https://picsum.photos/seed/103/200/200',
    jobTitle: 'Senior Product Manager',
    category: 'Product',
    jobCategory: 'Permanent',
    employmentType: 'Full-time',
    region: 'APAC',
    country: 'Singapore',
    homeOffice: 'Singapore',
    contractualOffice: 'Singapore',
    tenantId: 'TEN-001',
    tenantName: 'Innovate Corp',
    status: 'Active',
    profile: {
      personal: {
        phone: '+65 9123 4567',
        address: '78 Business Hub, Singapore',
        dob: '1988-11-30',
        emergencyContact: 'Mei Lin (Wife) - +65 9876 5432',
        contactPriority: 'High',
        specialNeeds: 'None',
      },
      education: [
        {
          degree: 'MBA',
          university: 'INSEAD',
          year: 2015,
        },
      ],
      skills: ['Product Management', 'Agile', 'Market Analysis', 'JIRA'],
      courses: ['Certified Scrum Product Owner'],
      hobbies: ['Traveling', 'Cooking'],
      volunteering: [],
      resumeUris: [],
      certificateUris: [],
    },
     jobHistory: [
      {
        position: 'Senior Product Manager',
        company: 'Invorg',
        startDate: '2019-08-01',
        endDate: null,
        salary: 160000,
      },
    ],
    leave: {
        sick: { entitled: 10, taken: 1 },
        vacation: { entitled: 20, taken: 15 },
        personal: { entitled: 5, taken: 0 },
    }
  },
    {
    id: 'USR-004',
    name: 'Samira Khan',
    email: 'samira.k@invorg.com',
    avatar: 'https://picsum.photos/seed/104/200/200',
    jobTitle: 'PCO Manager',
    category: 'PCO',
    jobCategory: 'Permanent',
    employmentType: 'Full-time',
    region: 'NA',
    country: 'USA',
    homeOffice: 'New York, NY',
    contractualOffice: 'New York, NY',
    tenantId: 'TEN-002',
    tenantName: 'Global Solutions',
    status: 'Active',
    profile: {
      personal: {
        phone: '987-654-3210',
        address: '456 Culture Ln, New York, NY',
        dob: '1985-02-20',
        emergencyContact: 'Omar Khan (Husband) - 987-654-3211',
        contactPriority: 'High',
        specialNeeds: 'None',
      },
      education: [
         {
          degree: 'B.A. in Human Resources',
          university: 'Cornell University',
          year: 2007,
        },
      ],
      skills: ['Recruiting', 'Employee Relations', 'HR Policies', 'Talent Management'],
      courses: ['Advanced Talent Management'],
      hobbies: ['Reading', 'Gardening'],
      volunteering: ['SHRM Foundation'],
      resumeUris: [],
      certificateUris: [],
    },
    jobHistory: [
      {
        position: 'PCO Manager',
        company: 'Invorg',
        startDate: '2018-02-12',
        endDate: null,
        salary: 130000,
      },
    ],
    leave: {
        sick: { entitled: 10, taken: 4 },
        vacation: { entitled: 20, taken: 8 },
        personal: { entitled: 7, taken: 5 },
    }
  },
  {
    id: 'USR-005',
    name: 'Ben Carter',
    email: 'ben.c@invorg.com',
    avatar: 'https://picsum.photos/seed/105/200/200',
    jobTitle: 'DevOps Engineer',
    category: 'Engineering',
    jobCategory: 'On Contract',
    employmentType: 'Full-time',
    region: 'EMEA',
    country: 'Germany',
    homeOffice: 'Berlin, DE',
    contractualOffice: 'Remote',
    tenantId: 'TEN-003',
    tenantName: 'Creative Minds Inc.',
    status: 'Active',
    profile: {
      personal: {
        phone: '+49 30 12345678',
        address: '101 Code Allee, Berlin, DE',
        dob: '1995-07-07',
        emergencyContact: 'Klaus Mueller (Friend) - +49 30 87654321',
        contactPriority: 'Low',
        specialNeeds: 'None',
      },
      education: [
         {
          degree: 'B.S. in Software Engineering',
          university: 'Technical University of Munich',
          year: 2017,
        },
      ],
      skills: ['Python', 'Django', 'Kubernetes', 'GCP', 'Docker'],
      courses: ['Google Cloud Certified Professional Cloud Architect'],
      hobbies: ['Cycling', 'Gaming'],
      volunteering: [],
      resumeUris: [],
      certificateUris: [],
    },
    jobHistory: [
       {
        position: 'DevOps Engineer',
        company: 'Invorg',
        startDate: '2022-01-10',
        endDate: null,
        salary: 115000,
      },
    ],
    leave: {
        sick: { entitled: 5, taken: 1 },
        vacation: { entitled: 15, taken: 10 },
        personal: { entitled: 0, taken: 0 },
    }
  },
];

export type Tenant = {
  id: string;
  name: string;
  domain: string;
  logo: string;
  description: string;
  status: 'Active' | 'Inactive';
};

export const tenantData: Tenant[] = [
  {
    id: 'TEN-001',
    name: 'Innovate Corp',
    domain: 'innovatecorp.com',
    logo: 'https://picsum.photos/seed/201/100/100',
    description: 'A forward-thinking technology company specializing in AI solutions.',
    status: 'Active',
  },
  {
    id: 'TEN-002',
    name: 'Global Solutions',
    domain: 'globalsolutions.io',
    logo: 'https://picsum.photos/seed/202/100/100',
    description: 'Connecting the world with seamless logistics and supply chain management.',
    status: 'Active',
  },
  {
    id: 'TEN-003',
    name: 'Creative Minds Inc.',
    domain: 'creativeminds.design',
    logo: 'https://picsum.photos/seed/203/100/100',
    description: 'A design agency that brings ideas to life with stunning visuals.',
    status: 'Inactive',
  },
];

export type Project = {
  id: string;
  name: string;
  code: string;
  version: string;
  owner: string;
  manager: string;
  tenantId: string;
  tenantName: string;
  resources: {
    teamMembers: {
      userId: string;
      name: string;
      role: string;
      allocation: number;
    }[];
  };
  techStack: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    cloudProvider: string;
    integrations: string[];
    devOps: string[];
  };
  timeline: {
    startDate: string;
    endDate: string;
    estimatedHours: number;
    milestones: {
      name: string;
      date: string;
      status: 'Completed' | 'In Progress' | 'Pending';
    }[];
  };
  support: {
    bugTrackerUrl: string;
    sla: string;
    escalationContacts: string[];
  };
  documentation: {
    architectureUrl: string;
    apiUrl: string;
    wikiUrl: string;
  };
  risks: {
    description: string;
    mitigation: string;
  }[];
  financials?: {
    estimatedCost: number;
    actualCost: number;
    licensingCost: number;
    budgetOwner: string;
  };
};

export const projectData: Project[] = [
  {
    id: 'PROJ-001',
    name: 'Staff Hub Portal',
    code: 'SHP-2024',
    version: '1.0.0',
    owner: 'Invorg Leadership',
    manager: 'Chen Wei',
    tenantId: 'TEN-001',
    tenantName: 'Innovate Corp',
    resources: {
      teamMembers: [
        { userId: 'USR-001', name: 'Alex Johnson', role: 'Lead Developer', allocation: 100 },
        { userId: 'USR-002', name: 'Maria Garcia', role: 'Lead Designer', allocation: 50 },
        { userId: 'USR-005', name: 'Ben Carter', role: 'DevOps Engineer', allocation: 75 },
      ],
    },
    techStack: {
      languages: ['TypeScript'],
      frameworks: ['Next.js', 'React', 'Tailwind CSS'],
      databases: ['Firestore'],
      cloudProvider: 'Firebase',
      integrations: ['Genkit AI'],
      devOps: ['GitHub', 'Firebase App Hosting'],
    },
    timeline: {
      startDate: '2024-05-01',
      endDate: '2024-09-30',
      estimatedHours: 800,
      milestones: [
        { name: 'MVP Launch', date: '2024-07-15', status: 'Completed' },
        { name: 'Full Feature Rollout', date: '2024-09-01', status: 'In Progress' },
      ],
    },
    support: {
      bugTrackerUrl: 'https://github.com/issues',
      sla: '24-hour response',
      escalationContacts: ['Chen Wei'],
    },
    documentation: {
      architectureUrl: '/docs/architecture',
      apiUrl: '/docs/api',
      wikiUrl: '/wiki',
    },
    risks: [
      { description: 'AI feature complexity may cause delays.', mitigation: 'Allocate additional dev time for AI tasks.' },
    ],
    financials: {
      estimatedCost: 50000,
      actualCost: 0,
      licensingCost: 2000,
      budgetOwner: 'Finance Dept',
    },
  },
  {
    id: 'PROJ-002',
    name: 'Global Logistics Dashboard',
    code: 'GLD-2025',
    version: '2.1.0',
    owner: 'Global Solutions Board',
    manager: 'Samira Khan',
    tenantId: 'TEN-002',
    tenantName: 'Global Solutions',
    resources: {
      teamMembers: [],
    },
    techStack: {
      languages: ['C#', 'JavaScript'],
      frameworks: ['.NET Core', 'Angular'],
      databases: ['SQL Server'],
      cloudProvider: 'Azure',
      integrations: ['SAP'],
      devOps: ['Azure DevOps'],
    },
    timeline: {
      startDate: '2025-01-10',
      endDate: '2025-12-20',
      estimatedHours: 2500,
      milestones: [
        { name: 'UAT', date: '2025-11-01', status: 'Pending' },
        { name: 'Go-Live', date: '2025-12-15', status: 'Pending' },
      ],
    },
    support: {
      bugTrackerUrl: 'https://dev.azure.com',
      sla: 'High-priority: 4 hours',
      escalationContacts: ['Samira Khan'],
    },
    documentation: {
      architectureUrl: '/docs/gld/architecture',
      apiUrl: '/docs/gld/api',
      wikiUrl: '/wiki/gld',
    },
    risks: [],
  },
  {
    id: 'PROJ-003',
    name: 'Quantum Leap',
    code: 'QL-2024',
    version: '1.0',
    owner: 'R&D Department',
    manager: 'Alex Johnson',
    tenantId: 'TEN-001',
    tenantName: 'Innovate Corp',
    resources: {
      teamMembers: [
        { userId: 'USR-001', name: 'Alex Johnson', role: 'Lead Scientist', allocation: 100 },
      ],
    },
    techStack: {
      languages: ['Python', 'C++'],
      frameworks: ['Qiskit', 'TensorFlow'],
      databases: ['HDF5'],
      cloudProvider: 'AWS',
      integrations: [],
      devOps: ['Git', 'Docker'],
    },
    timeline: {
      startDate: '2024-08-01',
      endDate: '2025-08-01',
      estimatedHours: 2000,
      milestones: [
        { name: 'Proof of Concept', date: '2024-12-01', status: 'Pending' },
      ],
    },
    support: {
      bugTrackerUrl: '',
      sla: '',
      escalationContacts: [],
    },
    documentation: {
      architectureUrl: '',
      apiUrl: '',
      wikiUrl: '',
    },
    risks: [
      { description: 'High technical uncertainty.', mitigation: 'Iterative research sprints.' },
    ],
  },
  {
    "id": "PROJ-166258",
    "name": "New Awesome Project",
    "code": "NAP-1",
    "version": "1.0",
    "owner": "Marketing",
    "manager": "Alex J",
    "tenantId": "TEN-001",
    "tenantName": "Innovate Corp",
    "techStack": {
      "languages": [
        "python",
        "typescript"
      ],
      "frameworks": [],
      "databases": [],
      "cloudProvider": "",
      "integrations": [],
      "devOps": []
    },
    "timeline": {
      "startDate": "2024-07-29T00:00:00.000Z",
      "endDate": "2024-08-30T00:00:00.000Z",
      "estimatedHours": 0,
      "milestones": []
    },
    "resources": {
      "teamMembers": []
    },
    "support": {
      "bugTrackerUrl": "",
      "sla": "",
      "escalationContacts": []
    },
    "documentation": {
      "architectureUrl": "",
      "apiUrl": "",
      "wikiUrl": ""
    },
    "risks": []
  }
];


export const currentUser = staffData[0];

    
