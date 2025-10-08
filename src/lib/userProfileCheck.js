// Utility to check if user profile exists
// This helps prevent showing username prompt for existing users

import { supabase } from './supabaseClient';

/**
 * Check if user profile exists in database
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>} - True if profile exists
 */
export const checkUserProfileExists = async (userId) => {
  try {
    console.log('Checking if user profile exists for:', userId);
    
    // Try to fetch user profile
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't exist
        console.log('User profile does not exist');
        return false;
      }
      
      // Other error - log it but assume user doesn't exist
      console.error('Error checking user profile:', error);
      return false;
    }

    // User exists
    console.log('User profile exists:', data);
    return true;
  } catch (error) {
    console.error('Failed to check user profile:', error);
    return false;
  }
};

/**
 * Get user profile safely
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object|null>} - User profile or null
 */
export const getUserProfileSafe = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user profile safely:', error);
    return null;
  }
};
