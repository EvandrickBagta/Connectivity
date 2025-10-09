import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import TeamMemberCard from './TeamMemberCard'
import Button from './Button'
import { 
  getProjectTeamMembers, 
  addUserToProjectTeam, 
  removeUserFromProjectTeam,
  isUserTeamMember 
} from '../services/projectService'

const TeamManagement = ({ activity, activityId }) => {
  const { user } = useUser()
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Check if current user is the owner
  const isOwner = activity?.ownerId === user?.id

  // Load team members
  useEffect(() => {
    loadTeamMembers()
  }, [activityId])

  const loadTeamMembers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Loading team members for project:', activityId)
      const result = await getProjectTeamMembers(activityId)
      console.log('Team members result:', result)
      
      if (result.success && result.team_members) {
        setTeamMembers(result.team_members)
        console.log('Team members loaded:', result.team_members)
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

  const handleRemoveMember = async (memberId) => {
    if (!isOwner) return
    
    try {
      const result = await removeUserFromProjectTeam(activityId, memberId)
      
      if (result.success) {
        // Reload team members to get updated data
        await loadTeamMembers()
      } else {
        setError(result.error || 'Failed to remove team member')
      }
    } catch (err) {
      setError('Failed to remove team member')
      console.error('Error removing member:', err)
    }
  }

  const handleInviteUser = async (userData) => {
    try {
      // TODO: Implement API call to invite user to team
      console.log('Inviting user:', userData)
      
      // For now, just close modal
      setShowInviteModal(false)
    } catch (err) {
      setError('Failed to invite user')
      console.error('Error inviting user:', err)
    }
  }

  const handleJoinTeam = async () => {
    try {
      const result = await addUserToProjectTeam(activityId, user.id)
      
      if (result.success) {
        // Reload team members to get updated data
        await loadTeamMembers()
      } else {
        setError(result.error || 'Failed to join team')
      }
    } catch (err) {
      setError('Failed to join team')
      console.error('Error joining team:', err)
    }
  }

  const handleLeaveTeam = async () => {
    try {
      const result = await removeUserFromProjectTeam(activityId, user.id)
      
      if (result.success) {
        // Reload team members to get updated data
        await loadTeamMembers()
      } else {
        setError(result.error || 'Failed to leave team')
      }
    } catch (err) {
      setError('Failed to leave team')
      console.error('Error leaving team:', err)
    }
  }

  // Check if current user is already a team member
  const isCurrentUserMember = teamMembers.some(member => member.id === user?.id)
  const isCurrentUserOwner = teamMembers.some(member => member.id === user?.id && member.is_owner)
  
  // Debug logging
  console.log('Team membership check:', {
    currentUserId: user?.id,
    teamMembers: teamMembers,
    isCurrentUserMember,
    isCurrentUserOwner,
    isOwner
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Team</h2>
          <p className="text-gray-600 mt-1">
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} • {activity.openings || 0} openings
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOwner && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invite Members
            </Button>
          )}
          
          
          {isCurrentUserMember && !isCurrentUserOwner && !isOwner && (
            <Button
              onClick={handleLeaveTeam}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave Team
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {teamMembers.length > 0 ? (
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
              isOwner={isOwner}
              onRemove={isOwner && !member.is_owner ? () => handleRemoveMember(member.id) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-4">Be the first to join this activity or invite others to get started!</p>
        </div>
      )}

      {/* Open Positions */}
      {activity.openings > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                We're Hiring! 🚀
              </h3>
              <p className="text-gray-700 mt-1">
                {activity.openings} {activity.openings === 1 ? 'position' : 'positions'} available. 
                Join our team and help make this activity amazing!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal Placeholder */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Invite Team Members</h3>
            <p className="text-gray-600 mb-4">
              TODO: Implement user search and invitation functionality
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowInviteModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowInviteModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamManagement
