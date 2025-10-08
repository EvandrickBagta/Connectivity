import React, { useState } from 'react'
import { createUser, updateUser, getUserById } from '../services/userService'

const UsernamePromptModal = ({ isOpen, onClose, clerkUser, onProfileSet, isUpdate = false }) => {
  const [displayName, setDisplayName] = useState('')
  const [contacts, setContacts] = useState([])
  const [interests, setInterests] = useState([])
  const [newContact, setNewContact] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill display name from database or Clerk data
  React.useEffect(() => {
    const initializeDisplayName = async () => {
      if (clerkUser) {
        try {
          // First, try to get existing user data from database
          const existingUser = await getUserById(clerkUser.id)
          
          if (existingUser && existingUser.display_name) {
            // Use existing display name from database
            console.log('📝 Using existing display name from database:', existingUser.display_name)
            setDisplayName(existingUser.display_name)
            
            // Also set existing contacts and interests if any
            if (existingUser.contacts && existingUser.contacts.length > 0) {
              setContacts(existingUser.contacts)
            }
            if (existingUser.interests && existingUser.interests.length > 0) {
              setInterests(existingUser.interests)
            }
          } else {
            // Fall back to Google account name if no existing display name
            const fullName = clerkUser.fullName || 
              (clerkUser.firstName && clerkUser.lastName ? 
                `${clerkUser.firstName} ${clerkUser.lastName}` : '')
            console.log('📝 Using Google account name as fallback:', fullName)
            setDisplayName(fullName)
          }
        } catch (error) {
          console.error('Error fetching existing user data:', error)
          // Fall back to Google account name if database query fails
          const fullName = clerkUser.fullName || 
            (clerkUser.firstName && clerkUser.lastName ? 
              `${clerkUser.firstName} ${clerkUser.lastName}` : '')
          setDisplayName(fullName)
        }
      }
    }

    initializeDisplayName()
  }, [clerkUser])

  const handleAddContact = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newContact.trim() && !contacts.includes(newContact.trim())) {
      setContacts(prev => [...prev, newContact.trim()])
      setNewContact('')
    }
  }

  const handleRemoveContact = (contactToRemove) => {
    setContacts(prev => prev.filter(contact => contact !== contactToRemove))
  }

  const handleAddInterest = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests(prev => [...prev, newInterest.trim()])
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(prev => prev.filter(interest => interest !== interestToRemove))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!displayName.trim()) {
      setError('Please enter a display name')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const userData = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        display_name: displayName.trim(),
        avatar_url: clerkUser.imageUrl,
        contacts: contacts,
        interests: interests
      }

      if (isUpdate) {
        // Update existing user
        console.log('🔄 Updating existing user profile:', userData);
        console.log('🔄 isUpdate flag is true, calling updateUser');
        await updateUser(clerkUser.id, userData);
      } else {
        // Create new user
        console.log('➕ Creating new user profile:', userData);
        console.log('➕ isUpdate flag is false, calling createUser');
        await createUser(userData);
      }
      
      onProfileSet(userData)
      onClose()
    } catch (error) {
      console.error('Failed to create user profile:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      if (error.message.includes('relation "users" does not exist')) {
        setError('Database table not found. Please contact support.')
      } else if (error.message.includes('permission denied')) {
        setError('Permission denied. Please check your authentication.')
      } else {
        setError(`Failed to create profile: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 text-2xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isUpdate ? 'Complete Your Profile' : 'Welcome!'}
            </h2>
            <p className="text-gray-600">
              {isUpdate 
                ? 'Your profile is missing some information. Let\'s complete it.'
                : 'Let\'s set up your profile to get started'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your full name"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                This is how your name will appear to others
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacts
              </label>
              
              {/* Add New Contact */}
              <div className="flex gap-2">
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
                  placeholder="Add a contact..."
                  maxLength={50}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddContact}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !newContact.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Current Contacts */}
              {contacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {contacts.map((contact, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {contact}
                      <button
                        type="button"
                        onClick={() => handleRemoveContact(contact)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                        disabled={isSubmitting}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add to add contacts (emails, phone numbers, etc.)
              </p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              
              {/* Add New Interest */}
              <div className="flex gap-2">
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
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !newInterest.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Current Interests */}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                        disabled={isSubmitting}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add to add interests and skills
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !displayName.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting 
                  ? (isUpdate ? 'Updating...' : 'Creating...') 
                  : (isUpdate ? 'Update Profile' : 'Create Profile')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UsernamePromptModal
