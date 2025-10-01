// Mock project data - empty array for production
const mockProjects = []

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
