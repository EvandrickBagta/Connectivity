import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import TeamMemberCard from './TeamMemberCard'
import { getProjectTeamMembers, removeUserFromProjectTeam } from '../services/projectService'

const ActivityTeam = ({ activity }) => {
  const { user } = useUser()
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const [teamError, setTeamError] = useState(null)

  // Load team members from database
  useEffect(() => {
    loadTeamMembers()
  }, [activity.id])

  const loadTeamMembers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Loading team members for activity:', activity.id)
      const result = await getProjectTeamMembers(activity.id)
      console.log('Activity team members result:', result)
      
      if (result.success && result.team_members) {
        setTeamMembers(result.team_members)
        console.log('Activity team members loaded:', result.team_members)
      } else {
        setError(result.error || 'Failed to load team members')
        console.error('Failed to load team members:', result.error)
      }
    } catch (err) {
      setError('Failed to load team members')
      console.error('Error loading team members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveTeam = async () => {
    if (!activity?.id || !user?.id || isLeaving) return
    
    setIsLeaving(true)
    setTeamError(null)
    
    try {
      const result = await removeUserFromProjectTeam(activity.id, user.id)
      
      if (result.success) {
        // Reload team members to get updated data
        await loadTeamMembers()
      } else {
        setTeamError(result.error || 'Failed to leave team')
      }
    } catch (error) {
      setTeamError('Failed to leave team')
      console.error('Error leaving team:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  // Check if current user is a team member
  const isCurrentUserMember = teamMembers.some(member => member.id === user?.id)
  const isCurrentUserOwner = teamMembers.some(member => member.id === user?.id && member.is_owner)

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600 mt-1">
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} • {activity.openings || 0} openings
          </p>
        </div>
        
        {/* Leave Team Button - Show if user is a team member (not owner) */}
        {user?.id && isCurrentUserMember && !isCurrentUserOwner && (
          <button
            onClick={handleLeaveTeam}
            disabled={isLeaving}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLeaving ? 'Leaving...' : 'Leave Team'}
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Team Error Message */}
      {teamError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Team Error</h3>
              <p className="text-sm text-red-700 mt-1">{teamError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {!isLoading && !error && teamMembers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={{
                id: member.id,
                name: member.display_name,
                role: member.team_role,
                isOwner: member.is_owner,
                skills: member.skills_experience || [],
                avatar: member.avatar_url
              }}
            />
          ))}
        </div>
      ) : !isLoading && !error ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No team members yet. Be the first to join!</p>
        </div>
      ) : null}

      {/* Open Positions */}
      {activity.openings > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            We're Hiring! 🚀
          </h3>
          <p className="text-gray-700">
            {activity.openings} {activity.openings === 1 ? 'position' : 'positions'} available. 
            Join our team and help make this activity amazing!
          </p>
        </div>
      )}
    </div>
  )
}

export default ActivityTeam

