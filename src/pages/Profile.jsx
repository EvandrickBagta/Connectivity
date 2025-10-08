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
  const [newActivity, setNewActivity] = useState('')  // NEW: For adding activities
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

  // NEW: Activities management functions
  const handleAddActivity = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newActivity.trim() && !formData.involved_activities.includes(newActivity.trim())) {
      setFormData(prev => ({
        ...prev,
        involved_activities: [...prev.involved_activities, newActivity.trim()]
      }))
      setNewActivity('')
    }
  }

  const handleRemoveActivity = (activityToRemove) => {
    setFormData(prev => ({
      ...prev,
      involved_activities: prev.involved_activities.filter(activity => activity !== activityToRemove)
    }))
  }


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
    
    setIsSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const updatedProfile = await updateUser(clerkUser.id, formData)
      setUserProfile(updatedProfile)
      setSuccess('Profile updated successfully!')
      setIsEditMode(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <span className="text-3xl" style={{display: userProfile?.avatar_url ? 'none' : 'block'}}>👤</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {isEditMode ? 'Edit Profile' : 'My Profile'}
                  </h1>
                  <p className="text-indigo-100 mt-1">
                    {isEditMode ? 'Update your personal information' : 'View and manage your profile'}
                  </p>
                </div>
              </div>
              {!isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-6 mt-6">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mt-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Profile View or Edit Form */}
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-8">

            {/* Row 1: Display Name and Avatar URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your display name"
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">This is how your name will appear to others</p>
              </div>

              {/* Avatar URL */}
              <div>
                <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar_url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">URL to your profile picture</p>
              </div>
            </div>

            {/* Row 2: Role and Academic Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="Student"
                      checked={formData.role === 'Student'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={isSaving}
                    />
                    <span>Student</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="Faculty"
                      checked={formData.role === 'Faculty'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={isSaving}
                    />
                    <span>Faculty</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="Organization"
                      checked={formData.role === 'Organization'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={isSaving}
                    />
                    <span>Organization</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Select your primary role on the platform</p>
              </div>

              {/* Academic Level (only for students) */}
              {formData.role === 'Student' && (
                <div>
                  <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Level
                  </label>
                  <select
                    id="seniority"
                    name="seniority"
                    value={formData.seniority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isSaving}
                  >
                    <option value="">Select your academic level</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Your current academic level</p>
                </div>
              )}
            </div>

            {/* Row 3: Interests and Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                
                {/* Add New Interest */}
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add an interest (e.g., Web Development, Data Science)..."
                    maxLength={50}
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    disabled={isSaving || !newInterest.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {/* Current Interests */}
                {formData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
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
                
                <p className="text-xs text-gray-500 mt-1">Add your areas of interest for better project matching</p>
              </div>

              {/* Skills & Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills & Experience
                </label>
                
                {/* Add New Skill */}
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a skill (e.g., JavaScript, Project Management)..."
                    maxLength={50}
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={isSaving || !newSkill.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {/* Current Skills */}
                {formData.skills_experience.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills_experience.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-green-600 hover:text-green-800"
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
                
                <p className="text-xs text-gray-500 mt-1">Showcase your technical and professional skills</p>
              </div>

              {/* Involved Activities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Involved Activities
                </label>
                
                {/* Add New Activity */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddActivity(e)
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add an activity (e.g., Web Dev Club, Hackathon Team)..."
                    maxLength={100}
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={isSaving || !newActivity.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {/* Current Activities */}
                {formData.involved_activities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.involved_activities.map((activity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(activity)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
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
                
                <p className="text-xs text-gray-500 mt-1">List activities and projects you're currently involved in</p>
              </div>

              {/* Contacts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contacts
                </label>
                
                {/* Add New Contact */}
                <div className="flex gap-2 mb-3">
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a contact (email, phone, etc.)..."
                    maxLength={50}
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    disabled={isSaving || !newContact.trim()}
                  >
                    Add
                  </button>
                </div>
                
                {/* Current Contacts */}
                {formData.contacts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.contacts.map((contact, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        {contact}
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(contact)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
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
                
                <p className="text-xs text-gray-500 mt-1">Add contact information for collaboration</p>
              </div>
            </div>


              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !formData.display_name.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* Profile View */
            <div className="p-6 space-y-8">
              {/* Row 1: Display Name and Avatar URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <div className="text-lg text-gray-900">
                    {userProfile?.display_name || 'No display name set'}
                  </div>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <div className="text-gray-900">
                    {userProfile?.avatar_url ? (
                      <div className="flex items-center space-x-3">
                        <img 
                          src={userProfile.avatar_url} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <div style={{display: 'none'}} className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                        <span className="text-sm text-gray-600 break-all">{userProfile.avatar_url}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                        <span className="text-gray-500 italic">No avatar URL set</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Role and Academic Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="text-lg text-gray-900">
                    {userProfile?.role || 'No role set'}
                  </div>
                </div>

                {/* Academic Level (only for students) */}
                {userProfile?.role === 'Student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Level
                    </label>
                    <div className="text-lg text-gray-900">
                      {userProfile?.seniority || 'No academic level set'}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Interests and Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  {userProfile?.interests && userProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No interests listed</div>
                  )}
                </div>

                {/* Skills & Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Experience
                  </label>
                  {userProfile?.skills_experience && userProfile.skills_experience.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills_experience.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No skills listed</div>
                  )}
                </div>

                {/* Involved Activities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Involved Activities
                  </label>
                  {userProfile?.involved_activities && userProfile.involved_activities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.involved_activities.map((activity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No activities listed</div>
                  )}
                </div>

                {/* Contacts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacts
                  </label>
                  {userProfile?.contacts && userProfile.contacts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.contacts.map((contact, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                        >
                          {contact}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No contacts listed</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

