import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserById } from '../services/userService';
import { checkUserProfileBypass } from '../lib/bypassUserCheck';
import UsernamePromptModal from '../components/UsernamePromptModal';

const UserContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (!isLoaded) return;
      
      if (!clerkUser) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      // Clear any existing localStorage flags to ensure fresh database check
      localStorage.removeItem(`username_setup_completed_${clerkUser.id}`);

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Checking for existing user profile for:', clerkUser.id);
        
        // Check if user profile exists using bypass method
        let profile = await checkUserProfileBypass(clerkUser.id);
        
        // If bypass method fails, try direct getUserById as fallback
        if (!profile) {
          console.log('🔄 Bypass method failed, trying direct getUserById as fallback');
          try {
            profile = await getUserById(clerkUser.id);
            console.log('🔄 Direct getUserById result:', profile);
          } catch (fallbackError) {
            console.error('❌ Direct getUserById also failed:', fallbackError);
          }
        }
        
        if (profile) {
          // Check if profile is complete (has display_name)
          const hasDisplayName = profile.display_name && profile.display_name.trim() !== '';
          
          console.log('🔍 Profile completeness check:', {
            hasDisplayName,
            display_name: profile.display_name,
            profile_id: profile.id,
            full_profile: profile
          });
          
          if (hasDisplayName) {
            // Profile is complete, set profile and hide prompt
            console.log('✅ Found complete user profile:', profile);
            console.log('✅ Setting userProfile and hiding prompt');
            setUserProfile(profile);
            setShowUsernamePrompt(false);
          } else {
            // Profile exists but is incomplete, show profile prompt for update
            console.log('⚠️ User profile exists but is incomplete, showing prompt for update');
            console.log('Missing:', {
              display_name: !hasDisplayName
            });
            setShowUsernamePrompt(true);
            setIsUpdatingProfile(true);
          }
        } else {
          // User doesn't exist in database, show profile prompt for creation
          console.log('❌ No existing user profile found, showing prompt for creation');
          setShowUsernamePrompt(true);
          setIsUpdatingProfile(false);
        }
      } catch (err) {
        console.error('Failed to initialize user profile:', err);
        console.error('Error details:', err);
        
        // If we can't check the database, assume user doesn't exist and show prompt
        // This is safer than blocking the user
        console.log('Cannot check user profile, showing prompt as fallback');
        setShowUsernamePrompt(true);
        setIsUpdatingProfile(false);
        setError(null); // Clear any previous errors
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [clerkUser, isLoaded]);

  const refreshUserProfile = async () => {
    if (!clerkUser) return;
    
    try {
      const profile = await getUserById(clerkUser.id);
      setUserProfile(profile);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      setError(err.message);
    }
  };

  const handleUsernameSet = (userData) => {
    setUserProfile(userData);
    setShowUsernamePrompt(false);
    // No localStorage needed - we always check the database
  };

  const handleCloseUsernamePrompt = () => {
    setShowUsernamePrompt(false);
    // If user closes without setting username, they'll need to sign out and back in
    // or we could redirect them to a profile setup page
  };

  const value = {
    userProfile,
    isLoading,
    error,
    refreshUserProfile,
    isAuthenticated: !!clerkUser,
    clerkUser,
    showUsernamePrompt
  };

  return (
    <UserContext.Provider value={value}>
      {children}
      {showUsernamePrompt && clerkUser && (
        <UsernamePromptModal
          isOpen={showUsernamePrompt}
          onClose={handleCloseUsernamePrompt}
          clerkUser={clerkUser}
          onProfileSet={handleUsernameSet}
          isUpdate={isUpdatingProfile}
        />
      )}
    </UserContext.Provider>
  );
};