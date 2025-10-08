import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { getUserById, updateUser } from '../services/userService'
import { useUserProfile } from '../contexts/UserContext'

const Profile = () => {
  const { user: clerkUser } = useUser()
  const { userProfile, setUserProfile } = useUserProfile()
  
  const [formData, setFormData] = useState({
    display_name: '',
    profile_description: '',
    profile_icon: '',
    contacts: [],
    interests: []
  })
  
  const [newContact, setNewContact] = useState('')
  const [newInterest, setNewInterest] = useState('')
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
          setFormData({
            display_name: profile.display_name || '',
            profile_description: profile.profile_description || '',
            profile_icon: profile.profile_icon || '',
            contacts: profile.contacts || [],
            interests: profile.interests || []
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data')
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
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                {formData.profile_icon ? (
                  <span className="text-3xl">{formData.profile_icon}</span>
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-indigo-100 mt-1">Manage your personal information and preferences</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

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

            {/* Profile Icon */}
            <div>
              <label htmlFor="profile_icon" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Icon
              </label>
              <input
                type="text"
                id="profile_icon"
                name="profile_icon"
                value={formData.profile_icon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="(Emoji or Icon)"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">Enter an emoji or icon to represent yourself</p>
            </div>

            {/* Profile Description */}
            <div>
              <label htmlFor="profile_description" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Description
              </label>
              <textarea
                id="profile_description"
                name="profile_description"
                value={formData.profile_description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell others about yourself, your interests, and what you're working on..."
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">A brief description about yourself and your interests</p>
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
                  placeholder="Add an interest..."
                  maxLength={30}
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
              
              <p className="text-xs text-gray-500 mt-1">Add your interests and skills</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving || !formData.display_name.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

