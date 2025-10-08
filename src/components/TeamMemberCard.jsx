import React, { useState, useEffect } from 'react'
import { getDirectUserDisplayName } from '../lib/directUserFetch'
import { getSimpleUserDisplayName, updateSimpleUserCache } from '../lib/simpleUserCache'

const TeamMemberCard = ({ userId, role, isCurrentUser, isOwner }) => {
  // Start with simple fallback name for immediate rendering
  const [displayName, setDisplayName] = useState(() => getSimpleUserDisplayName(userId))

  useEffect(() => {
    const fetchDisplayName = async () => {
      try {
        const name = await getDirectUserDisplayName(userId)
        // Ensure we're setting a string, not an object
        if (typeof name === 'string') {
          setDisplayName(name)
          updateSimpleUserCache(userId, name)
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
  }, [userId])

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
            {isCurrentUser 
              ? (typeof displayName === 'string' ? `${displayName} (You)` : 'You') 
              : (typeof displayName === 'string' ? displayName : 'Unknown')
            }
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">
          {role}
        </span>
      </div>
    </div>
  )
}

export default TeamMemberCard
