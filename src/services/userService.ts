import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  contacts: string[];
  interests: string[];
  profile_icon?: string;
  profile_description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  contacts: string[];
  interests: string[];
  profile_icon?: string;
  profile_description?: string;
}

/**
 * Get user profile by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching user by ID:', userId);
    
    // Check current auth status
    const { data: { user: authUser } } = await supabase.auth.getUser();
    console.log('Current Supabase auth user:', authUser);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log('No user found with ID:', userId);
        return null;
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    console.log('User fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Create a new user profile using the bypass function
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    console.log('Creating user with data:', userData);
    
    // First check if user already exists
    const existingUser = await getUserById(userData.id);
    if (existingUser) {
      console.log('⚠️ User already exists, updating instead of creating:', existingUser);
      return await updateUser(userData.id, userData);
    }
    
    // Use the bypass function instead of direct table insert
    const { data, error } = await supabase
      .rpc('create_user_profile', {
        user_id: userData.id,
        user_display_name: userData.display_name,
        user_email: userData.email,
        user_avatar_url: userData.avatar_url,
        user_contacts: userData.contacts,
        user_interests: userData.interests,
        user_profile_icon: userData.profile_icon,
        user_profile_description: userData.profile_description
      });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // If it's a duplicate key error, try updating instead
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        console.log('🔄 Duplicate key error, attempting to update existing user instead');
        return await updateUser(userData.id, userData);
      }
      
      throw new Error(`Failed to create user: ${error.message}`);
    }

    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user profile using bypass function
 */
export const updateUser = async (userId: string, updates: Partial<CreateUserData>): Promise<User> => {
  try {
    console.log('🔄 Updating user profile with bypass function:', { userId, updates });
    
    // Use the bypass function to update user profile
    const { data, error } = await supabase
      .rpc('update_user_profile', {
        user_id: userId,
        user_display_name: updates.display_name,
        user_email: updates.email,
        user_avatar_url: updates.avatar_url,
        user_contacts: updates.contacts,
        user_interests: updates.interests,
        user_profile_icon: updates.profile_icon,
        user_profile_description: updates.profile_description
      });

    if (error) {
      console.error('❌ Bypass function error, falling back to direct update:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Fallback to direct update if bypass function doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (fallbackError) {
        console.error('❌ Fallback update also failed:', fallbackError);
        throw new Error(`Failed to update user: ${fallbackError.message}`);
      }

      console.log('✅ Fallback update successful:', fallbackData);
      return fallbackData;
    }

    if (!data) {
      throw new Error('User not found or update failed');
    }

    console.log('✅ User profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


