import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;  // NEW: User's bio/description
  contacts: string[];
  interests: string[];  // User's activity interests
  role?: 'Student' | 'Faculty' | 'Organization';  // User's role
  seniority?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';  // Academic level
  skills_experience: string[];  // NEW: User's skills and experiences
  involved_activities: string[];  // NEW: Activities user is involved in
  created_at: string;
}

export interface CreateUserData {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;  // NEW: User's bio/description
  contacts: string[];
  interests: string[];  // User's activity interests
  role?: 'Student' | 'Faculty' | 'Organization';  // User's role
  seniority?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';  // Academic level
  skills_experience: string[];  // NEW: User's skills and experiences
  involved_activities: string[];  // NEW: Activities user is involved in
}

/**
 * Get user profile by ID using standardized SQL function
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    console.log('Fetching user by ID:', userId);
    
    const { data, error } = await supabase
      .rpc('get_user_profile_enhanced', { user_id: userId });

    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString(),
        function: 'get_user_profile_enhanced'
      });
      
      // Create detailed error message (without exposing user ID)
      const detailedError = `Failed to fetch user profile. 
Supabase error: ${error.message}. 
Error code: ${error.code}. 
This could be due to: 1) User doesn't exist in database, 2) RLS policy blocking access, 3) Database connection issue, 4) SQL function 'get_user_profile' not found. 
Troubleshooting: 1) Check if user exists in database, 2) Verify get_user_profile function exists, 3) Review RLS policies in rls_policies.sql, 4) Check database connectivity, 5) Verify user ID format. 
Function called: get_user_profile_enhanced, 
Supabase error code: ${error.code}`;
      
      throw new Error(detailedError);
    }

    if (!data || !data.success) {
      console.log('⚠️ No user found in database or error in response:', data);
      console.log('This could indicate: 1) User doesn\'t exist in database, 2) RLS policy blocking access, 3) User ID format issue');
      return null;
    }

    console.log('User fetched successfully:', data.user);
    return data.user;
  } catch (error) {
    console.error('❌ Error fetching user by ID:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      function: 'get_user_profile'
    });
    
    // Re-throw with additional context if it's not already a detailed error
    if (!error.message.includes('Failed to fetch user profile')) {
      const enhancedError = new Error(`getUserById failed. 
Original error: ${error.message}. 
This affects profile loading functionality. 
Check: 1) Database connection, 2) SQL function exists, 3) User authentication, 4) RLS policies. 
Function: getUserById`);
      enhancedError.stack = error.stack;
      throw enhancedError;
    }
    
    throw error;
  }
};

/**
 * Create a new user profile using standardized SQL function
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    console.log('Creating user with data:', userData);
    
    const { data, error } = await supabase
      .rpc('create_user_profile', {
        user_id: userData.id,
        user_display_name: userData.display_name,
        user_email: userData.email,
        user_avatar_url: userData.avatar_url,
        user_bio: userData.bio,  // NEW: Added bio field
        user_contacts: userData.contacts,
        user_interests: userData.interests || [],
        user_role: userData.role,
        user_seniority: userData.seniority
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
 * Update user profile using standardized SQL function
 */
export const updateUser = async (userId: string, updates: Partial<CreateUserData>): Promise<User> => {
  try {
    console.log('🔄 Updating user profile:', { userId, updates });
    
    const { data, error } = await supabase
      .rpc('update_user_profile', {
        user_id: userId,
        user_display_name: updates.display_name,
        user_email: updates.email,
        user_avatar_url: updates.avatar_url,
        user_bio: updates.bio,  // NEW: Added bio field
        user_contacts: updates.contacts,
        user_interests: updates.interests,
        user_role: updates.role,
        user_seniority: updates.seniority,
        user_skills_experience: updates.skills_experience  // Added - requires running add_skills_to_update_function.sql
        // Note: involved_activities is NOT included - it's auto-managed by database triggers
      });

    if (error) {
      console.error('❌ Update error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // If user doesn't exist, create them instead
      if (error.message.includes('not found')) {
        console.log('🔄 User not found, creating new user instead of updating');
        return await createUser({ id: userId, ...updates });
      }
      
      throw new Error(`Failed to update user: ${error.message}`);
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

/**
 * Upsert user profile (create or update) using standardized SQL function
 * This is the recommended function to use for user profile management
 */
export const upsertUser = async (userData: CreateUserData): Promise<User> => {
  try {
    console.log('🔄 Upserting user profile:', userData);
    
    const { data, error } = await supabase
      .rpc('upsert_user_profile', {
        user_id: userData.id,
        user_display_name: userData.display_name,
        user_email: userData.email,
        user_avatar_url: userData.avatar_url,
        user_bio: userData.bio,  // NEW: Added bio field
        user_contacts: userData.contacts,
        user_interests: userData.interests || [],
        user_role: userData.role,
        user_seniority: userData.seniority
      });

    if (error) {
      console.error('❌ Upsert error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      throw new Error(`Failed to upsert user: ${error.message}`);
    }

    if (!data) {
      throw new Error('Upsert operation failed');
    }

    console.log('✅ User profile upserted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
};


