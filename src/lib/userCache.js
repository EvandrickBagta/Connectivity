// User cache utility for resolving user IDs to display names
// This integrates with the real user database

import { getUserById } from '../services/userService';

const userCache = new Map()
const pendingRequests = new Map()

/**
 * Get user display name by ID
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - Display name or fallback
 */
export const getUserDisplayName = async (userId) => {
  if (!userId) return 'Unknown'
  
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId).display_name || userCache.get(userId).username || 'Unknown'
  }
  
  // Check if request is already pending
  if (pendingRequests.has(userId)) {
    return pendingRequests.get(userId)
  }
  
  // Fetch from database
  const fetchPromise = fetchUserFromDatabase(userId)
  pendingRequests.set(userId, fetchPromise)
  
  try {
    const user = await fetchPromise
    userCache.set(userId, user)
    return user.display_name || user.username || 'Unknown'
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return 'Unknown'
  } finally {
    pendingRequests.delete(userId)
  }
}

/**
 * Fetch user from database
 */
const fetchUserFromDatabase = async (userId) => {
  try {
    const user = await getUserById(userId)
    if (user) {
      return user
    }
    // Return fallback user data
    return {
      id: userId,
      username: 'Unknown',
      display_name: 'Unknown',
      avatar_url: null
    }
  } catch (error) {
    console.error('Error fetching user from database:', error)
    throw error
  }
}

/**
 * Batch fetch user names for multiple IDs
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Object>} - Map of userId -> user data
 */
export const batchGetUsers = async (userIds) => {
  const result = {}
  const uncachedIds = []
  
  // Check cache first
  userIds.forEach(userId => {
    if (userCache.has(userId)) {
      result[userId] = userCache.get(userId)
    } else {
      uncachedIds.push(userId)
    }
  })
  
  // Fetch uncached users
  if (uncachedIds.length > 0) {
    try {
      const users = await Promise.all(
        uncachedIds.map(async (userId) => {
          try {
            const user = await getUserById(userId)
            if (user) {
              userCache.set(userId, user)
              return { userId, user }
            }
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error)
          }
          return { userId, user: null }
        })
      )
      
      users.forEach(({ userId, user }) => {
        result[userId] = user || {
          id: userId,
          username: 'Unknown',
          display_name: 'Unknown',
          avatar_url: null
        }
      })
    } catch (error) {
      console.error('Error in batchGetUsers:', error)
      // Fill with fallback data
      uncachedIds.forEach(userId => {
        if (!result[userId]) {
          result[userId] = {
            id: userId,
            username: 'Unknown',
            display_name: 'Unknown',
            avatar_url: null
          }
        }
      })
    }
  }
  
  return result
}

/**
 * Clear the user cache
 */
export const clearUserCache = () => {
  userCache.clear()
  pendingRequests.clear()
}

/**
 * Preload user data for better performance
 * @param {string[]} userIds - Array of user IDs to preload
 */
export const preloadUsers = async (userIds) => {
  const uncachedIds = userIds.filter(id => !userCache.has(id))
  if (uncachedIds.length > 0) {
    await batchGetUsers(uncachedIds)
  }
}
