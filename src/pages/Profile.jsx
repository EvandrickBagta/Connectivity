import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { getUserById, updateUser } from '../services/userService'
import { useUserProfile } from '../contexts/UserContext'

const Profile = () => {
  const { user: clerkUser } = useUser()
  const { userProfile, setUserProfile } = useUserProfile()
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    avatar_url: '',
    bio: '',        // NEW: User's bio/description
    contacts: [],
    interests: [],  // User's activity interests
    role: '',       // User's role
    seniority: '',  // Academic level
    skills_experience: [],  // NEW: User's skills and experiences
    involved_activities: []  // NEW: Activities user is involved in
  })
  
  const [newContact, setNewContact] = useState('')
  const [newInterest, setNewInterest] = useState('')  // For adding interests
  const [newSkill, setNewSkill] = useState('')  // NEW: For adding skills
  // Removed: newActivity state - activities are now auto-managed by database triggers
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!clerkUser) return
      
      try {
        setIsLoading(true)
        const profile = await getUserById(clerkUser.id)
        
        if (profile) {
          setUserProfile(profile)
          setFormData({
            display_name: profile.display_name || '',
            avatar_url: profile.avatar_url || '',
            bio: profile.bio || '',             // NEW: Initialize bio
            contacts: profile.contacts || [],
            interests: profile.interests || [],  // Initialize interests
            role: profile.role || '',           // Initialize role
            seniority: profile.seniority || '',  // Initialize seniority
            skills_experience: profile.skills_experience || [],  // NEW: Initialize skills
            involved_activities: profile.involved_activities || []  // NEW: Initialize activities
          })
        }
      } catch (error) {
        console.error('❌ Profile page failed to load user data:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          clerkUserExists: !!clerkUser,
          clerkUserLoaded: clerkUser !== undefined
        })
        
        // Create detailed error message for debugging (without exposing user ID)
        const detailedError = `Profile page failed to load user data. 
Error: ${error.message}. 
This prevents users from viewing/editing their profile. 
Troubleshooting: 1) Check user authentication (Clerk user exists: ${!!clerkUser}), 2) Verify getUserById function, 3) Review user schema, 4) Check RLS policies, 5) Verify database connection. 
Current operation: loadProfile, 
Function called: getUserById, 
User authentication status: ${clerkUser ? 'authenticated' : 'not authenticated'}`
        
        setError(detailedError)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [clerkUser])

  // 🛡️ SAFETY CHECK: Auto-refetch if critical fields are missing
  useEffect(() => {
    const checkAndRefetch = async () => {
      // Skip if already loading or in edit mode (formData might be empty while editing)
      if (isLoading || isEditMode || !clerkUser || !userProfile) return
      
      // Check if critical fields are missing (undefined means they were never set)
      const hasMissingFields = 
        userProfile.display_name === undefined ||
        userProfile.contacts === undefined ||
        userProfile.interests === undefined ||
        userProfile.role === undefined ||
        userProfile.skills_experience === undefined ||
        userProfile.involved_activities === undefined
      
      if (hasMissingFields) {
        console.warn('⚠️ Detected missing profile fields, auto-refetching...', {
          display_name: userProfile.display_name,
          contacts: userProfile.contacts,
          interests: userProfile.interests,
          role: userProfile.role,
          skills_experience: userProfile.skills_experience,
          involved_activities: userProfile.involved_activities
        })
        
        try {
          // Refetch fresh data from database
          const freshProfile = await getUserById(clerkUser.id)
          
          if (freshProfile) {
            console.log('✅ Auto-refetch successful, updating profile')
            setUserProfile(freshProfile)
            setFormData({
              display_name: freshProfile.display_name || '',
              avatar_url: freshProfile.avatar_url || '',
              bio: freshProfile.bio || '',             // NEW: Initialize bio
              contacts: freshProfile.contacts || [],
              interests: freshProfile.interests || [],
              role: freshProfile.role || '',
              seniority: freshProfile.seniority || '',
              skills_experience: freshProfile.skills_experience || [],
              involved_activities: freshProfile.involved_activities || []
            })
          }
        } catch (error) {
          console.error('❌ Auto-refetch failed:', error)
          // Don't set error state - this is a background operation
        }
      }
    }
    
    // Run check after a short delay to avoid race conditions
    const timeoutId = setTimeout(checkAndRefetch, 500)
    
    return () => clearTimeout(timeoutId)
  }, [userProfile, isLoading, isEditMode, clerkUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddContact = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newContact.trim() && !formData.contacts.includes(newContact.trim())) {
      setFormData(prev => ({
        ...prev,
        contacts: [...prev.contacts, newContact.trim()]
      }))
      setNewContact('')
    }
  }

  const handleRemoveContact = (contactToRemove) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact !== contactToRemove)
    }))
  }

  // NEW: Interest management functions
  const handleAddInterest = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  // NEW: Skills management functions
  const handleAddSkill = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newSkill.trim() && !formData.skills_experience.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills_experience: [...prev.skills_experience, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills_experience: prev.skills_experience.filter(skill => skill !== skillToRemove)
    }))
  }

  // Removed: handleAddActivity and handleRemoveActivity functions
  // Activities are now auto-managed by database triggers when projects are created/deleted


  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        avatar_url: userProfile.avatar_url || '',
        bio: userProfile.bio || '',             // NEW: Reset bio
        contacts: userProfile.contacts || [],
        interests: userProfile.interests || [],  // Reset interests
        role: userProfile.role || '',           // Reset role
        seniority: userProfile.seniority || '',  // Reset seniority
        skills_experience: userProfile.skills_experience || [],  // NEW: Reset skills
        involved_activities: userProfile.involved_activities || []  // NEW: Reset activities
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!clerkUser) return
    
    // 🛡️ CHECK: Warn if there's unsaved text in input fields
    const hasUnsavedText = 
      newContact.trim() !== '' || 
      newInterest.trim() !== '' || 
      newSkill.trim() !== ''
    
    if (hasUnsavedText) {
      const confirmSave = window.confirm(
        'You have unsaved text in input fields:\n\n' +
        (newContact.trim() ? `• Contact: "${newContact}"\n` : '') +
        (newInterest.trim() ? `• Interest: "${newInterest}"\n` : '') +
        (newSkill.trim() ? `• Skill: "${newSkill}"\n` : '') +
        '\nDid you forget to click "Add"?\n\n' +
        'Click OK to save without these items, or Cancel to go back and add them.'
      )
      
      if (!confirmSave) {
        return // User wants to go back and add items
      }
    }
    
    setIsSaving(true)
    setError('')
    setSuccess('')
    
    // Store the current values to display after save
    const valuesToDisplay = {
      ...userProfile,  // Keep existing fields (id, created_at, etc.)
      ...formData      // Update with edited values
    }
    
    try {
      // Save changes to database
      await updateUser(clerkUser.id, formData)
      
      // Update profile with the values we know are correct
      // This shows the edited values immediately without waiting for API
      setUserProfile(valuesToDisplay)
      
      setSuccess('Profile updated successfully!')
      setIsEditMode(false)
      
      // Clear the unsaved input fields
      setNewContact('')
      setNewInterest('')
      setNewSkill('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
      // On error, don't update the profile - keep showing original values
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                    ) : null}
                    <span className="text-4xl" style={{display: userProfile?.avatar_url ? 'none' : 'block'}}>👤</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {userProfile?.display_name || 'Your Profile'}
                  </h1>
                  <div className="flex items-center space-x-4 text-indigo-100">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{userProfile?.role || 'Member'}</span>
                    </span>
                    {userProfile?.seniority && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.755a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                        </svg>
                        <span>{userProfile.seniority}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="mt-6 md:mt-0 px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8">
            {isEditMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Bio Section - Full Width */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <label htmlFor="bio" className="block text-lg font-semibold text-gray-800 mb-3">
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>About Me</span>
                    </span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Tell us about yourself, your interests, goals, or anything you'd like others to know..."
                    disabled={isSaving}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-blue-600">Share your story and let others get to know you better</p>
                    <span className="text-xs text-gray-500">{formData.bio.length}/500</span>
                  </div>
                </div>

                {/* Row 1: Display Name and Avatar URL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label htmlFor="display_name" className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Display Name *</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      id="display_name"
                      name="display_name"
                      value={formData.display_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Your display name"
                      required
                      disabled={isSaving}
                    />
                    <p className="text-xs text-gray-500 mt-2">This is how your name will appear to others</p>
                  </div>

                  {/* Avatar URL */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label htmlFor="avatar_url" className="block text-sm font-semibold text-gray-700 mb-3">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Profile Picture</span>
                      </span>
                    </label>
                    <input
                      type="url"
                      id="avatar_url"
                      name="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="https://example.com/avatar.jpg"
                      disabled={isSaving}
                    />
                    <p className="text-xs text-gray-500 mt-2">URL to your profile picture</p>
                  </div>
                </div>

                {/* Row 2: Role and Academic Level */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Role Selection */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        <span>Role *</span>
                      </span>
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="Student"
                          checked={formData.role === 'Student'}
                          onChange={handleInputChange}
                          className="mr-3 text-green-600 focus:ring-green-500"
                          disabled={isSaving}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🎓</span>
                          <span className="font-medium">Student</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="Faculty"
                          checked={formData.role === 'Faculty'}
                          onChange={handleInputChange}
                          className="mr-3 text-green-600 focus:ring-green-500"
                          disabled={isSaving}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">👨‍🏫</span>
                          <span className="font-medium">Faculty</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="role"
                          value="Organization"
                          checked={formData.role === 'Organization'}
                          onChange={handleInputChange}
                          className="mr-3 text-green-600 focus:ring-green-500"
                          disabled={isSaving}
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🏢</span>
                          <span className="font-medium">Organization</span>
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Select your primary role on the platform</p>
                  </div>

                  {/* Academic Level (only for students) */}
                  {formData.role === 'Student' && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <label htmlFor="seniority" className="block text-sm font-semibold text-gray-700 mb-3">
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Academic Level</span>
                        </span>
                      </label>
                      <select
                        id="seniority"
                        name="seniority"
                        value={formData.seniority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        disabled={isSaving}
                      >
                        <option value="">Select your academic level</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Your current academic level</p>
                    </div>
                  )}
                </div>

                {/* Row 3: Interests and Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Interests */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Interests</span>
                      </span>
                    </label>
                    
                    {/* Add New Interest */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddInterest(e)
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        placeholder="Add an interest (e.g., Web Development, Data Science)..."
                        maxLength={50}
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className={`px-4 py-3 text-white rounded-lg transition-all disabled:opacity-50 ${
                          newInterest.trim() 
                            ? 'bg-purple-600 hover:bg-purple-700 animate-pulse ring-2 ring-purple-400' 
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                        disabled={isSaving || !newInterest.trim()}
                        title={newInterest.trim() ? 'Click to add this interest!' : ''}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Current Interests */}
                    {formData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200"
                          >
                            <span className="mr-1">💜</span>
                            {interest}
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-2 text-purple-600 hover:text-purple-800 transition-colors"
                              disabled={isSaving}
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">Add your areas of interest for better project matching</p>
                  </div>

                  {/* Skills & Experience */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Skills & Experience</span>
                      </span>
                    </label>
                    
                    {/* Add New Skill */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSkill(e)
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Add a skill (e.g., JavaScript, Project Management)..."
                        maxLength={50}
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className={`px-4 py-3 text-white rounded-lg transition-all disabled:opacity-50 ${
                          newSkill.trim() 
                            ? 'bg-green-600 hover:bg-green-700 animate-pulse ring-2 ring-green-400' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        disabled={isSaving || !newSkill.trim()}
                        title={newSkill.trim() ? 'Click to add this skill!' : ''}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Current Skills */}
                    {formData.skills_experience.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills_experience.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                          >
                            <span className="mr-1">⚡</span>
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                              disabled={isSaving}
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">Showcase your technical and professional skills</p>
                  </div>
                </div>

                {/* Row 4: Activities and Contacts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Involved Activities - READ ONLY (Auto-managed by system) */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>Involved Activities</span>
                        <span className="text-xs text-gray-500 italic">(Auto-managed)</span>
                      </span>
                    </label>
                    
                    {userProfile?.involved_activities && userProfile.involved_activities.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {userProfile.involved_activities.map((activity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                          >
                            <span className="mr-1">🎯</span>
                            {activity}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                        No activities yet. Create or join a project to see your activities here!
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      💡 Activities are automatically added when you create or join projects, 
                      and removed when you leave or delete projects.
                    </p>
                  </div>

                  {/* Contacts */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Contacts</span>
                      </span>
                    </label>
                    
                    {/* Add New Contact */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddContact(e)
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Add a contact (email, phone, etc.)..."
                        maxLength={50}
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={handleAddContact}
                        className={`px-4 py-3 text-white rounded-lg transition-all disabled:opacity-50 ${
                          newContact.trim() 
                            ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse ring-2 ring-indigo-400' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                        disabled={isSaving || !newContact.trim()}
                        title={newContact.trim() ? 'Click to add this contact!' : ''}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Current Contacts */}
                    {formData.contacts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.contacts.map((contact, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 text-sm rounded-full border border-indigo-200"
                          >
                            <span className="mr-1">📧</span>
                            {contact}
                            <button
                              type="button"
                              onClick={() => handleRemoveContact(contact)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                              disabled={isSaving}
                            >
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">Add contact information for collaboration</p>
                  </div>
                </div>


                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !formData.display_name.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Profile View */
              <div className="space-y-8">
                {/* Bio Section */}
                {userProfile?.bio && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                        <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Display Name</h3>
                    </div>
                    <p className="text-gray-700 text-lg">
                      {userProfile?.display_name || 'No display name set'}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Role</h3>
                    </div>
                    <p className="text-gray-700 text-lg">
                      {userProfile?.role || 'No role set'}
                    </p>
                  </div>

                  {/* Academic Level (only for students) */}
                  {userProfile?.role === 'Student' && userProfile?.seniority && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Academic Level</h3>
                      </div>
                      <p className="text-gray-700 text-lg">
                        {userProfile.seniority}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interests and Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Interests */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Interests</h3>
                    </div>
                    {userProfile?.interests && userProfile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200"
                          >
                            <span className="mr-1">💜</span>
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">No interests listed</div>
                    )}
                  </div>

                  {/* Skills & Experience */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Skills & Experience</h3>
                    </div>
                    {userProfile?.skills_experience && userProfile.skills_experience.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills_experience.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                          >
                            <span className="mr-1">⚡</span>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">No skills listed</div>
                    )}
                  </div>
                </div>

                {/* Activities and Contacts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Involved Activities */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Involved Activities</h3>
                    </div>
                    {userProfile?.involved_activities && userProfile.involved_activities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.involved_activities.map((activity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                          >
                            <span className="mr-1">🎯</span>
                            {activity}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">No activities listed</div>
                    )}
                  </div>

                  {/* Contacts */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Contacts</h3>
                    </div>
                    {userProfile?.contacts && userProfile.contacts.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userProfile.contacts.map((contact, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 text-sm rounded-full border border-indigo-200"
                          >
                            <span className="mr-1">📧</span>
                            {contact}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic bg-gray-50 p-3 rounded-lg">No contacts listed</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

