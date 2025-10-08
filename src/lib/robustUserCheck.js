// Robust user profile checking that handles RLS issues
import { supabase } from './supabaseClient';

/**
 * Check if user profile exists with better error handling
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object|null>} - User profile or null
 */
export const checkUserProfileRobust = async (userId) => {
  try {
    console.log('Checking user profile robustly for:', userId);
    
    // Try to fetch user profile with minimal data
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, contacts')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't exist
        console.log('User profile does not exist in database');
        return null;
      }
      
      // Other database error
      console.error('Database error checking user profile:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (data) {
      console.log('User profile found:', data);
      return data;
    }

    // No data returned
    console.log('No user profile data returned');
    return null;
  } catch (error) {
    console.error('Failed to check user profile robustly:', error);
    
    // Re-throw the error so the calling code can handle it
    throw error;
  }
};

/**
 * Check if user profile exists (boolean result)
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>} - True if user exists
 */
export const userProfileExists = async (userId) => {
  try {
    const profile = await checkUserProfileRobust(userId);
    return profile !== null;
  } catch (error) {
    console.error('Error checking if user profile exists:', error);
    // If we can't check, assume user doesn't exist to be safe
    return false;
  }
};
