// Simple synchronous user cache for immediate rendering
// This provides fallback names while async operations complete

const simpleUserCache = new Map()

// Mock user data for immediate display
const mockUsers = {
  'demo-user-1': 'Alice Johnson',
  'demo-user-2': 'Bob Smith', 
  'demo-user-3': 'Carol Davis',
  'demo-user-4': 'David Wilson',
  'demo-user-5': 'Eva Brown',
  'demo-user-6': 'Frank Miller',
  'demo-user-7': 'Grace Lee',
  'demo-user-8': 'Henry Taylor',
  'demo-user-9': 'Ivy Chen',
  'demo-user-10': 'Jack Anderson',
  'demo-user-11': 'Kate Martinez',
  'demo-user-12': 'Leo Thompson',
}

/**
 * Get user display name synchronously (fallback)
 * @param {string} userId - The user ID
 * @returns {string} - Display name or fallback
 */
export const getSimpleUserDisplayName = (userId) => {
  if (!userId) return 'Unknown'
  
  // Check cache first
  if (simpleUserCache.has(userId)) {
    return simpleUserCache.get(userId)
  }
  
  // Check mock data
  if (mockUsers[userId]) {
    simpleUserCache.set(userId, mockUsers[userId])
    return mockUsers[userId]
  }
  
  // Generate a fallback name based on user ID
  const fallbackName = `User ${userId.slice(-4)}`
  simpleUserCache.set(userId, fallbackName)
  return fallbackName
}

/**
 * Update cache with real user data
 * @param {string} userId - The user ID
 * @param {string} displayName - The real display name
 */
export const updateSimpleUserCache = (userId, displayName) => {
  if (userId && displayName) {
    simpleUserCache.set(userId, displayName)
  }
}

/**
 * Clear the simple cache
 */
export const clearSimpleUserCache = () => {
  simpleUserCache.clear()
}
