import React, { useState, useEffect } from 'react'
import { getDirectUserDisplayName } from '../lib/directUserFetch'
import { getSimpleUserDisplayName, updateSimpleUserCache } from '../lib/simpleUserCache'

const TeamMemberCard = ({ 
  userId, 
  role, 
  isCurrentUser, 
  isOwner, 
  member, // New prop for member object
  onRemove // New prop for remove function
}) => {
  // Handle both old props and new member object
  const actualUserId = userId || member?.id
  const actualRole = role || member?.role || member?.team_role
  const actualIsOwner = isOwner || member?.isOwner || member?.is_owner
  const actualIsCurrentUser = isCurrentUser || (member?.id && typeof window !== 'undefined' && window.user?.id === member.id)
  
  // Start with simple fallback name for immediate rendering
  const [displayName, setDisplayName] = useState(() => {
    // If we have a member object with display_name, use it
    if (member?.name || member?.display_name) {
      return member.name || member.display_name
    }
    return getSimpleUserDisplayName(actualUserId)
  })

  useEffect(() => {
    // If we already have a display name from the member object, use it
    if (member?.name || member?.display_name) {
      setDisplayName(member.name || member.display_name)
      return
    }

    const fetchDisplayName = async () => {
      try {
        const name = await getDirectUserDisplayName(actualUserId)
        // Ensure we're setting a string, not an object
        if (typeof name === 'string') {
          setDisplayName(name)
          updateSimpleUserCache(actualUserId, name)
        } else {
          console.warn('getDirectUserDisplayName returned non-string:', name)
          setDisplayName('Unknown')
        }
      } catch (error) {
        console.error('Failed to fetch team member name:', error)
        setDisplayName('Unknown')
      }
    }

    fetchDisplayName()
  }, [actualUserId, member?.name, member?.display_name])

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-semibold text-sm">
            {typeof displayName === 'string' ? displayName.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-900">
            {actualIsCurrentUser 
              ? (typeof displayName === 'string' ? `${displayName} (You)` : 'You') 
              : (typeof displayName === 'string' ? displayName : 'Unknown')
            }
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">
          {actualRole}
        </span>
        {onRemove && !actualIsOwner && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default TeamMemberCard
