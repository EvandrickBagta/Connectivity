// Mock project data
const mockProjects = [
  {
    id: '1',
    title: 'Campus Gardening App',
    summary: 'A mobile app connecting students interested in sustainable gardening and urban farming.',
    description: 'We are building a comprehensive platform that helps students find gardening spaces, share resources, and learn about sustainable practices. The app will include features like plant identification, watering schedules, and community forums. Our vision is to create a thriving community of student gardeners who can share knowledge, resources, and fresh produce. The platform will feature interactive maps showing available garden plots, a plant care database with personalized recommendations, and a marketplace for trading seeds and tools. We\'re looking for developers with experience in mobile app development, UI/UX designers who understand sustainable design principles, and backend developers who can build scalable systems for community management.',
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      major: 'Computer Science',
      avatar: null
    },
    tags: ['CS', 'Biology', 'Sustainability', 'Mobile'],
    rolesNeeded: ['Frontend Developer', 'UI/UX Designer', 'Backend Developer'],
    teamSizeNeeded: 4,
    currentTeamSize: 1,
    applicants: 12,
    createdAt: '2024-01-15T10:30:00Z',
    saved: false,
    applied: false
  },
  {
    id: '2',
    title: 'Study Buddy Matcher',
    summary: 'AI-powered platform to match students with compatible study partners based on learning styles.',
    description: 'An intelligent matching system that analyzes study habits, learning preferences, and academic goals to connect students with ideal study partners. Features include compatibility scoring, study session scheduling, and progress tracking. The platform uses machine learning algorithms to match students based on their learning styles, availability, and academic goals. We\'re building a comprehensive system that includes video call integration, shared whiteboards, and AI-powered study recommendations. The app will help students find study partners for specific subjects, form study groups, and track their academic progress together. We need AI engineers to develop the matching algorithms, data scientists to analyze learning patterns, and product managers to oversee the user experience.',
    author: {
      id: 'user2',
      name: 'Alex Rodriguez',
      major: 'Psychology',
      avatar: null
    },
    tags: ['AI', 'Psychology', 'Education', 'Machine Learning'],
    rolesNeeded: ['AI Engineer', 'Data Scientist', 'Product Manager'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 8,
    createdAt: '2024-01-14T14:20:00Z',
    saved: false,
    applied: false
  },
  {
    id: '3',
    title: 'Local Food Network',
    summary: 'Connecting students with local farmers and food producers for sustainable eating.',
    description: 'A marketplace platform that connects students with local farmers, food producers, and sustainable food sources. Features include farmer profiles, product listings, delivery scheduling, and community reviews.',
    author: {
      id: 'user3',
      name: 'Emma Thompson',
      major: 'Business',
      avatar: null
    },
    tags: ['Business', 'Agriculture', 'Community', 'Sustainability'],
    rolesNeeded: ['Full Stack Developer', 'Marketing Specialist', 'Business Analyst'],
    teamSizeNeeded: 4,
    currentTeamSize: 2,
    applicants: 15,
    createdAt: '2024-01-13T09:15:00Z',
    saved: false,
    applied: false
  },
  {
    id: '4',
    title: 'Mental Health Tracker',
    summary: 'Anonymous platform for students to track and improve their mental wellness.',
    description: 'A privacy-focused mental health tracking app that helps students monitor their emotional well-being, set wellness goals, and access resources. Features include mood tracking, journaling, meditation guides, and crisis support.',
    author: {
      id: 'user4',
      name: 'David Kim',
      major: 'Health Sciences',
      avatar: null
    },
    tags: ['Health', 'Psychology', 'Technology', 'Privacy'],
    rolesNeeded: ['Mobile Developer', 'UX Researcher', 'Security Engineer'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 6,
    createdAt: '2024-01-12T16:45:00Z',
    saved: false,
    applied: false
  },
  {
    id: '5',
    title: 'Campus Event Planner',
    summary: 'Collaborative tool for organizing and promoting student events across campus.',
    description: 'A comprehensive event management platform that helps student organizations plan, promote, and execute campus events. Features include event creation, RSVP management, venue booking, and analytics.',
    author: {
      id: 'user5',
      name: 'Maria Garcia',
      major: 'Event Management',
      avatar: null
    },
    tags: ['Event Planning', 'Marketing', 'Community', 'Management'],
    rolesNeeded: ['Project Manager', 'Frontend Developer', 'Marketing Coordinator'],
    teamSizeNeeded: 5,
    currentTeamSize: 2,
    applicants: 20,
    createdAt: '2024-01-11T11:30:00Z',
    saved: false,
    applied: false
  },
  {
    id: '6',
    title: 'Eco-Friendly Transport',
    summary: 'Ride-sharing app focused on reducing carbon footprint through carpooling.',
    description: 'A sustainable transportation platform that connects students for eco-friendly commuting. Features include route optimization, carbon footprint tracking, rewards for sustainable choices, and integration with public transit.',
    author: {
      id: 'user6',
      name: 'James Wilson',
      major: 'Environmental Science',
      avatar: null
    },
    tags: ['Environmental', 'Transportation', 'Technology', 'Sustainability'],
    rolesNeeded: ['Backend Developer', 'Mobile Developer', 'Data Analyst'],
    teamSizeNeeded: 4,
    currentTeamSize: 1,
    applicants: 9,
    createdAt: '2024-01-10T13:20:00Z',
    saved: false,
    applied: false
  },
  {
    id: '7',
    title: 'Virtual Study Rooms',
    summary: 'Online collaborative study spaces with video, screen sharing, and productivity tools.',
    description: 'A virtual study platform that recreates the library experience online. Features include video calls, screen sharing, shared whiteboards, file collaboration, and study session scheduling.',
    author: {
      id: 'user7',
      name: 'Lisa Park',
      major: 'Computer Science',
      avatar: null
    },
    tags: ['CS', 'Education', 'Video', 'Collaboration'],
    rolesNeeded: ['Full Stack Developer', 'Video Engineer', 'UI Designer'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 11,
    createdAt: '2024-01-09T15:10:00Z',
    saved: false,
    applied: false
  },
  {
    id: '8',
    title: 'Skill Exchange Platform',
    summary: 'Students teach each other skills in exchange for learning new ones.',
    description: 'A peer-to-peer learning platform where students can offer their skills and learn from others. Features include skill matching, lesson scheduling, progress tracking, and achievement badges.',
    author: {
      id: 'user8',
      name: 'Ryan O\'Connor',
      major: 'Education',
      avatar: null
    },
    tags: ['Education', 'Community', 'Learning', 'Skills'],
    rolesNeeded: ['Product Manager', 'Frontend Developer', 'Community Manager'],
    teamSizeNeeded: 4,
    currentTeamSize: 2,
    applicants: 7,
    createdAt: '2024-01-08T12:00:00Z',
    saved: false,
    applied: false
  },
  {
    id: '9',
    title: 'Campus Safety Network',
    summary: 'Real-time safety alerts and emergency response system for campus.',
    description: 'A comprehensive safety platform that provides real-time alerts, emergency contacts, safe route planning, and community reporting. Features include GPS tracking, emergency protocols, and safety education.',
    author: {
      id: 'user9',
      name: 'Aisha Patel',
      major: 'Public Safety',
      avatar: null
    },
    tags: ['Safety', 'Emergency', 'Community', 'Technology'],
    rolesNeeded: ['Mobile Developer', 'Security Specialist', 'UX Designer'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 5,
    createdAt: '2024-01-07T08:30:00Z',
    saved: false,
    applied: false
  },
  {
    id: '10',
    title: 'Academic Resource Hub',
    summary: 'Centralized platform for sharing study materials, notes, and academic resources.',
    description: 'A collaborative platform where students can share study materials, lecture notes, and academic resources. Features include file sharing, version control, search functionality, and peer review.',
    author: {
      id: 'user10',
      name: 'Michael Brown',
      major: 'Information Systems',
      avatar: null
    },
    tags: ['Education', 'Resources', 'Sharing', 'Academic'],
    rolesNeeded: ['Backend Developer', 'Frontend Developer', 'Content Manager'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 13,
    createdAt: '2024-01-06T14:45:00Z',
    saved: false,
    applied: false
  },
  {
    id: '11',
    title: 'Student Housing Marketplace',
    summary: 'Platform for finding roommates, sublets, and housing options near campus.',
    description: 'A comprehensive housing platform that helps students find roommates, sublets, and housing options. Features include profile matching, virtual tours, lease management, and community reviews.',
    author: {
      id: 'user11',
      name: 'Sophie Martin',
      major: 'Real Estate',
      avatar: null
    },
    tags: ['Housing', 'Community', 'Real Estate', 'Matching'],
    rolesNeeded: ['Full Stack Developer', 'UI/UX Designer', 'Business Analyst'],
    teamSizeNeeded: 4,
    currentTeamSize: 2,
    applicants: 18,
    createdAt: '2024-01-05T10:15:00Z',
    saved: false,
    applied: false
  },
  {
    id: '12',
    title: 'Campus Fitness Tracker',
    summary: 'Social fitness platform connecting students for workouts and health challenges.',
    description: 'A social fitness platform that helps students track workouts, find workout partners, and participate in campus-wide fitness challenges. Features include activity tracking, social features, and gamification.',
    author: {
      id: 'user12',
      name: 'Carlos Mendez',
      major: 'Kinesiology',
      avatar: null
    },
    tags: ['Fitness', 'Health', 'Social', 'Gamification'],
    rolesNeeded: ['Mobile Developer', 'Backend Developer', 'Fitness Expert'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 14,
    createdAt: '2024-01-04T16:20:00Z',
    saved: false,
    applied: false
  },
  {
    id: '13',
    title: 'Language Exchange Network',
    summary: 'Connect students learning different languages for practice and cultural exchange.',
    description: 'A language learning platform that connects students for language exchange, conversation practice, and cultural learning. Features include video calls, lesson planning, progress tracking, and cultural events.',
    author: {
      id: 'user13',
      name: 'Yuki Tanaka',
      major: 'Linguistics',
      avatar: null
    },
    tags: ['Language', 'Education', 'Cultural', 'Exchange'],
    rolesNeeded: ['Frontend Developer', 'Language Expert', 'Community Manager'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 10,
    createdAt: '2024-01-03T11:40:00Z',
    saved: false,
    applied: false
  },
  {
    id: '14',
    title: 'Campus Job Board',
    summary: 'Curated job board connecting students with part-time work and internships.',
    description: 'A specialized job board that connects students with part-time work, internships, and freelance opportunities. Features include job matching, application tracking, and career guidance.',
    author: {
      id: 'user14',
      name: 'Rachel Green',
      major: 'Career Services',
      avatar: null
    },
    tags: ['Jobs', 'Career', 'Internships', 'Professional'],
    rolesNeeded: ['Full Stack Developer', 'Career Counselor', 'Marketing Specialist'],
    teamSizeNeeded: 4,
    currentTeamSize: 2,
    applicants: 16,
    createdAt: '2024-01-02T09:25:00Z',
    saved: false,
    applied: false
  },
  {
    id: '15',
    title: 'Student Art Gallery',
    summary: 'Digital gallery showcasing student artwork and creative projects.',
    description: 'An online gallery platform where students can showcase their artwork, photography, and creative projects. Features include portfolio creation, art sales, community voting, and exhibition planning.',
    author: {
      id: 'user15',
      name: 'Olivia White',
      major: 'Fine Arts',
      avatar: null
    },
    tags: ['Art', 'Creative', 'Gallery', 'Portfolio'],
    rolesNeeded: ['Frontend Developer', 'Art Curator', 'UI Designer'],
    teamSizeNeeded: 3,
    currentTeamSize: 1,
    applicants: 8,
    createdAt: '2024-01-01T13:50:00Z',
    saved: false,
    applied: false
  }
]

// Simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Available tags for filtering
export const availableTags = [
  'CS', 'AI', 'Mobile', 'Web', 'Data Science', 'Machine Learning',
  'Business', 'Marketing', 'Finance', 'Management',
  'Design', 'UI/UX', 'Graphic Design', 'Product Design',
  'Health', 'Psychology', 'Education', 'Research',
  'Environmental', 'Sustainability', 'Community', 'Social',
  'Technology', 'Innovation', 'Startup', 'Entrepreneurship'
]

// Sort options
export const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'mostApplicants', label: 'Most Applicants' },
  { value: 'trending', label: 'Trending' }
]

// Mock API function
export const fetchProjects = async ({ cursor, limit = 10, search = '', tags = [], sort = 'newest' }) => {
  // Simulate network latency
  await delay(800 + Math.random() * 400)
  
  let filteredProjects = [...mockProjects]
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProjects = filteredProjects.filter(project => 
      project.title.toLowerCase().includes(searchLower) ||
      project.summary.toLowerCase().includes(searchLower) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  // Apply tag filter
  if (tags.length > 0) {
    filteredProjects = filteredProjects.filter(project =>
      tags.some(tag => project.tags.includes(tag))
    )
  }
  
  // Apply sorting
  switch (sort) {
    case 'newest':
      filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'mostApplicants':
      filteredProjects.sort((a, b) => b.applicants - a.applicants)
      break
    case 'trending':
      // Random shuffle for trending
      filteredProjects.sort(() => Math.random() - 0.5)
      break
  }
  
  // Apply cursor-based pagination
  let startIndex = 0
  if (cursor) {
    const cursorIndex = filteredProjects.findIndex(project => project.id === cursor)
    startIndex = cursorIndex + 1
  }
  
  const endIndex = startIndex + limit
  const projects = filteredProjects.slice(startIndex, endIndex)
  const nextCursor = projects.length === limit && endIndex < filteredProjects.length 
    ? projects[projects.length - 1].id 
    : null
  
  return {
    projects,
    nextCursor,
    hasMore: !!nextCursor
  }
}
