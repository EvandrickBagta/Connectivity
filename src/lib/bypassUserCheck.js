// Bypass user profile checking that works with Clerk authentication
import { supabase } from './supabaseClient';

/**
 * Check if user profile exists using the bypass function
 * This works around RLS issues with Clerk authentication
 * @param {string} userId - Clerk user ID
 * @returns {Promise<Object|null>} - User profile or null
 */
export const checkUserProfileBypass = async (userId) => {
  try {
    console.log('🔍 Bypass check for user profile:', userId);
    
    // Use the bypass function that doesn't require Supabase auth
    const { data, error } = await supabase
      .rpc('check_user_profile_exists', {
        user_id: userId
      });

    if (error) {
      console.error('❌ Bypass function error:', error);
      
      // If the function doesn't exist yet, fall back to direct query
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        console.log('🔄 Bypass function not found, falling back to direct query');
        return await fallbackUserCheck(userId);
      }
      
      return null;
    }

    if (data && data.length > 0) {
      console.log('✅ User profile found via bypass:', data[0]);
      return data[0];
    }

    console.log('❌ No user profile found via bypass');
    return null;
  } catch (error) {
    console.error('❌ Failed to check user profile via bypass:', error);
    return null;
  }
};

/**
 * Fallback method for when bypass function doesn't exist
 * This tries to query directly but may fail due to RLS
 */
const fallbackUserCheck = async (userId) => {
  try {
    console.log('🔄 Fallback: Direct query for user profile:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, email, avatar_url, contacts, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Fallback query error:', error);
      return null;
    }

    if (data) {
      console.log('✅ User profile found via fallback:', data);
      return data;
    }

    console.log('❌ No user profile found via fallback');
    return null;
  } catch (error) {
    console.error('❌ Fallback check failed:', error);
    return null;
  }
};

/**
 * Check if user exists using bypass (boolean result)
 * @param {string} userId - Clerk user ID
 * @returns {Promise<boolean>} - True if user exists
 */
export const userExistsBypass = async (userId) => {
  try {
    const profile = await checkUserProfileBypass(userId);
    return profile !== null;
  } catch (error) {
    console.error('Error checking user existence via bypass:', error);
    return false;
  }
};
