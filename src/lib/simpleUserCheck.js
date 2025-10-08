// Simple, direct user profile checking
import { supabase } from './supabaseClient';

/**
 * Simple check if user profile exists
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object|null>} - User profile or null
 */
export const checkUserProfileSimple = async (userId) => {
  try {
    console.log('🔍 Simple check for user profile:', userId);
    
    // Direct query with minimal data
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, contacts')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle to avoid errors on no results

    if (error) {
      console.error('❌ Database error:', error);
      return null;
    }

    if (data) {
      console.log('✅ User profile found:', data);
      return data;
    }

    console.log('❌ No user profile found');
    return null;
  } catch (error) {
    console.error('❌ Failed to check user profile:', error);
    return null;
  }
};

/**
 * Check if user exists (boolean)
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>} - True if user exists
 */
export const userExists = async (userId) => {
  try {
    const profile = await checkUserProfileSimple(userId);
    return profile !== null;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};
