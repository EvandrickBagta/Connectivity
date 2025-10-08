// Direct user fetching utility that bypasses complex caching
// This provides a simple way to get user display names

import { supabase } from './supabaseClient';

const userCache = new Map();

/**
 * Get user display name directly from database
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - Display name or fallback
 */
export const getDirectUserDisplayName = async (userId) => {
  if (!userId) return 'Unknown';
  
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }
  
  try {
    console.log('Fetching user display name for:', userId);
    
    // Try RPC function first (bypasses RLS)
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_user_display_name', { user_id: userId });

    if (!rpcError && rpcData) {
      const displayName = rpcData || `User ${userId.slice(-4)}`;
      userCache.set(userId, displayName);
      console.log('Found user display name via RPC:', displayName);
      return displayName;
    }

    // Fallback to direct query if RPC fails
    console.log('RPC failed, trying direct query:', rpcError);
    const { data, error } = await supabase
      .from('users')
      .select('display_name, contacts')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      // Return fallback name
      const fallbackName = `User ${userId.slice(-4)}`;
      userCache.set(userId, fallbackName);
      return fallbackName;
    }

    if (data) {
      const displayName = data.display_name || data.username || `User ${userId.slice(-4)}`;
      userCache.set(userId, displayName);
      console.log('Found user display name via direct query:', displayName);
      return displayName;
    }

    // No user found
    const fallbackName = `User ${userId.slice(-4)}`;
    userCache.set(userId, fallbackName);
    return fallbackName;
  } catch (error) {
    console.error('Failed to fetch user display name:', error);
    const fallbackName = `User ${userId.slice(-4)}`;
    userCache.set(userId, fallbackName);
    return fallbackName;
  }
};

/**
 * Batch fetch multiple user display names
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Object>} - Map of userId -> displayName
 */
export const batchGetDirectUserNames = async (userIds) => {
  const result = {};
  const uncachedIds = [];
  
  // Check cache first
  userIds.forEach(userId => {
    if (userCache.has(userId)) {
      result[userId] = userCache.get(userId);
    } else {
      uncachedIds.push(userId);
    }
  });
  
  // Fetch uncached users
  if (uncachedIds.length > 0) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, display_name, contacts')
        .in('id', uncachedIds);

      if (error) {
        console.error('Error batch fetching users:', error);
      } else if (data) {
        data.forEach(user => {
          const displayName = user.display_name || user.username || `User ${user.id.slice(-4)}`;
          userCache.set(user.id, displayName);
          result[user.id] = displayName;
        });
      }
      
      // Fill in missing users with fallbacks
      uncachedIds.forEach(userId => {
        if (!result[userId]) {
          const fallbackName = `User ${userId.slice(-4)}`;
          userCache.set(userId, fallbackName);
          result[userId] = fallbackName;
        }
      });
    } catch (error) {
      console.error('Failed to batch fetch users:', error);
      // Fill with fallbacks
      uncachedIds.forEach(userId => {
        const fallbackName = `User ${userId.slice(-4)}`;
        userCache.set(userId, fallbackName);
        result[userId] = fallbackName;
      });
    }
  }
  
  return result;
};

/**
 * Clear the user cache
 */
export const clearDirectUserCache = () => {
  userCache.clear();
};
