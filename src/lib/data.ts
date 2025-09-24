export type StaffMember = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  category: 'Engineering' | 'Design' | 'Product' | 'PCO' | 'Marketing';
  employmentCategory: 'Full-time' | 'Part-time' | 'Contract';
  region: 'NA' | 'EMEA' | 'APAC' | 'LATAM' | 'Central' | 'Eastern';
  homeOffice: string;
  contractualOffice: string;
  profile: {
    personal: {
      phone: string;
      address: string;
      dob: string;
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
};

export const staffData: StaffMember[] = [
  {
    id: 'USR-001',
    name: 'Alex Johnson',
    email: 'alex.j@invorg.com',
    avatar: 'https://picsum.photos/seed/101/200/200',
    category: 'Engineering',
    employmentCategory: 'Full-time',
    region: 'NA',
    homeOffice: 'San Francisco, CA',
    contractualOffice: 'San Francisco, CA',
    profile: {
      personal: {
        phone: '123-456-7890',
        address: '123 Tech Ave, Silicon Valley, CA',
        dob: '1990-05-15',
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
      skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS'],
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
  },
  {
    id: 'USR-002',
    name: 'Maria Garcia',
    email: 'maria.g@invorg.com',
    avatar: 'https://picsum.photos/seed/102/200/200',
    category: 'Design',
    employmentCategory: 'Full-time',
    region: 'EMEA',
    homeOffice: 'London, UK',
    contractualOffice: 'London, UK',
    profile: {
      personal: {
        phone: '+44 20 7946 0958',
        address: '45 Creative St, London, UK',
        dob: '1992-08-22',
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
  },
  {
    id: 'USR-003',
    name: 'Chen Wei',
    email: 'chen.w@invorg.com',
    avatar: 'https://picsum.photos/seed/103/200/200',
    category: 'Product',
    employmentCategory: 'Full-time',
    region: 'APAC',
    homeOffice: 'Singapore',
    contractualOffice: 'Singapore',
    profile: {
      personal: {
        phone: '+65 9123 4567',
        address: '78 Business Hub, Singapore',
        dob: '1988-11-30',
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
  },
    {
    id: 'USR-004',
    name: 'Samira Khan',
    email: 'samira.k@invorg.com',
    avatar: 'https://picsum.photos/seed/104/200/200',
    category: 'PCO',
    employmentCategory: 'Full-time',
    region: 'NA',
    homeOffice: 'New York, NY',
    contractualOffice: 'New York, NY',
    profile: {
      personal: {
        phone: '987-654-3210',
        address: '456 Culture Ln, New York, NY',
        dob: '1985-02-20',
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
  },
  {
    id: 'USR-005',
    name: 'Ben Carter',
    email: 'ben.c@invorg.com',
    avatar: 'https://picsum.photos/seed/105/200/200',
    category: 'Engineering',
    employmentCategory: 'Contract',
    region: 'EMEA',
    homeOffice: 'Berlin, DE',
    contractualOffice: 'Remote',
    profile: {
      personal: {
        phone: '+49 30 12345678',
        address: '101 Code Allee, Berlin, DE',
        dob: '1995-07-07',
      },
      education: [
         {
          degree: 'B.S. in Software Engineering',
          university: 'Technical University of Munich',
          year: 2017,
        },
      ],
      skills: ['Python', 'Django', 'Kubernetes', 'GCP'],
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
  },
];

export const currentUser = staffData[0];
