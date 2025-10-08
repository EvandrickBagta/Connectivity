// User lookup service for fetching current display names
import { supabase } from './supabaseClient';

// Cache for user display names to avoid repeated queries
const userDisplayNameCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get current display name for a user ID
 * @param {string} userId - User ID to look up
 * @returns {Promise<string>} - Current display name or fallback
 */
export const getUserDisplayName = async (userId) => {
  try {
    // Check cache first
    const cached = userDisplayNameCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.displayName;
    }

    console.log('🔍 Fetching display name for user:', userId);
    
    // Use the bypass function to get current user data
    const { data, error } = await supabase
      .rpc('check_user_profile_exists', {
        user_id: userId
      });

    if (error) {
      console.error('❌ Error fetching user display name:', error);
      return 'Unknown User';
    }

    if (data && data.length > 0) {
      const user = data[0];
      const displayName = user.display_name || user.username || 'Unknown User';
      
      // Cache the result
      userDisplayNameCache.set(userId, {
        displayName,
        timestamp: Date.now()
      });
      
      console.log('✅ Found display name:', displayName);
      return displayName;
    }

    console.log('❌ No user found for ID:', userId);
    return 'Unknown User';
  } catch (error) {
    console.error('❌ Failed to fetch user display name:', error);
    return 'Unknown User';
  }
};

/**
 * Get display names for multiple users at once
 * @param {string[]} userIds - Array of user IDs
 * @returns {Promise<Map<string, string>>} - Map of userId -> displayName
 */
export const getMultipleUserDisplayNames = async (userIds) => {
  const results = new Map();
  
  // Check cache for all users first
  const uncachedIds = [];
  for (const userId of userIds) {
    const cached = userDisplayNameCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results.set(userId, cached.displayName);
    } else {
      uncachedIds.push(userId);
    }
  }

  // Fetch uncached users
  if (uncachedIds.length > 0) {
    try {
      console.log('🔍 Fetching display names for multiple users:', uncachedIds);
      
    // Use the bypass function to get all users at once
    const { data, error } = await supabase
      .rpc('get_multiple_users_by_ids', {
        user_ids: uncachedIds
      });

      if (error) {
        console.error('❌ Error fetching multiple user display names:', error);
        
        // If the function doesn't exist, try direct query as fallback
        if (error.message.includes('function') || error.message.includes('does not exist')) {
          console.log('🔄 Function not found, trying direct query fallback');
          try {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('users')
              .select('id, display_name, contacts')
              .in('id', uncachedIds);
            
            if (!fallbackError && fallbackData) {
              for (const user of fallbackData) {
                const displayName = user.display_name || 'Unknown User';
                results.set(user.id, displayName);
                userDisplayNameCache.set(user.id, {
                  displayName,
                  timestamp: Date.now()
                });
              }
            } else {
              throw new Error('Fallback query failed');
            }
          } catch (fallbackError) {
            console.error('❌ Fallback query also failed:', fallbackError);
            // Set fallback for all uncached users
            for (const userId of uncachedIds) {
              results.set(userId, 'Unknown User');
            }
          }
        } else {
          // Set fallback for all uncached users
          for (const userId of uncachedIds) {
            results.set(userId, 'Unknown User');
          }
        }
      } else {
        // Process results
        for (const user of data || []) {
          const displayName = user.display_name || user.username || 'Unknown User';
          results.set(user.id, displayName);
          
          // Cache the result
          userDisplayNameCache.set(user.id, {
            displayName,
            timestamp: Date.now()
          });
        }
        
        // Set fallback for any users not found
        for (const userId of uncachedIds) {
          if (!results.has(userId)) {
            results.set(userId, 'Unknown User');
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch multiple user display names:', error);
      // Set fallback for all uncached users
      for (const userId of uncachedIds) {
        results.set(userId, 'Unknown User');
      }
    }
  }

  return results;
};

/**
 * Clear the display name cache (useful for testing or when users update their names)
 */
export const clearDisplayNameCache = () => {
  userDisplayNameCache.clear();
  console.log('🗑️ Display name cache cleared');
};

/**
 * Clear cache for a specific user (useful when that user updates their name)
 * @param {string} userId - User ID to clear from cache
 */
export const clearUserDisplayNameCache = (userId) => {
  userDisplayNameCache.delete(userId);
  console.log('🗑️ Display name cache cleared for user:', userId);
};
