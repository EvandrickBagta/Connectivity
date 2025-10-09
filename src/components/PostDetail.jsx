import React, { useState, useEffect } from 'react'
import { useProjectById, useDeleteProject, useUpdateProject } from '../hooks/useProjects'
import { useUser } from '@clerk/clerk-react'
import TeamMemberCard from './TeamMemberCard'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import ActivityEditor from './ActivityEditor'
import { removeUserFromProjectTeam } from '../services/projectService'

const PostDetail = ({ postId, onBack, onApply, onSave, isDrawer = false, onNavigateToActivity, origin = 'explore', onAddToRecent, isSaved: initialIsSaved = false }) => {
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [teamError, setTeamError] = useState(null)
  
  // Sync saved state when prop changes
  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const { user } = useUser()

  const { data: project, isLoading, error } = useProjectById(postId)
  const deleteProjectMutation = useDeleteProject()
  const updateProjectMutation = useUpdateProject()

  // Debug logging for team membership
  useEffect(() => {
    if (project && user?.id) {
      const teamRosterKeys = project.teamRoster ? Object.keys(project.teamRoster) : []
      const isInTeamRoster = teamRosterKeys.includes(user.id)
      const isOwner = project.ownerId === user.id
      
      console.log('PostDetail team membership debug:', {
        projectId: project.id,
        currentUserId: user.id,
        projectOwnerId: project.ownerId,
        projectTeamIds: project.teamIds,
        projectTeamRoster: project.teamRoster,
        teamRosterKeys: teamRosterKeys,
        isOwner: isOwner,
        isInTeamRoster: isInTeamRoster,
        shouldShowLeaveButton: isInTeamRoster && !isOwner,
        teamRosterLength: teamRosterKeys.length
      })
    }
  }, [project, user?.id])

  const handleApply = async () => {
    if (isApplied || isApplying || !project) return
    
    setIsApplying(true)
    try {
      await onApply(project)
      setIsApplied(true)
    } catch (error) {
      console.error('Failed to apply:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleSave = async () => {
    if (!project) return
    
    setIsSaving(true)
    try {
      await onSave(project)
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Robust team membership check
  const isTeamMember = () => {
    if (!project || !user?.id) return false
    
    // Check if user is the owner
    if (project.ownerId === user.id) return true
    
    // Check if user is in teamIds array
    if (project.teamIds && Array.isArray(project.teamIds) && project.teamIds.includes(user.id)) {
      return true
    }
    
    // Check if user is in teamRoster object keys
    if (project.teamRoster && typeof project.teamRoster === 'object' && Object.keys(project.teamRoster).includes(user.id)) {
      return true
    }
    
    return false
  }

  const isProjectOwner = () => {
    return project && user?.id && project.ownerId === user.id
  }

  const handleLeaveTeam = async () => {
    if (!project || !user?.id || isLeaving) return
    
    setIsLeaving(true)
    setTeamError(null)
    
    try {
      const result = await removeUserFromProjectTeam(project.id, user.id)
      
      if (result.success) {
        // Refresh the project data to update team status
        window.location.reload()
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

  const handleShare = () => {
    if (project) {
      // Copy project URL to clipboard
      const url = `${window.location.origin}${window.location.pathname}?activity=${project.id}`
      navigator.clipboard.writeText(url).then(() => {
        // You could show a toast notification here
        console.log('Project URL copied to clipboard:', url)
      }).catch(err => {
        console.error('Failed to copy URL:', err)
      })
    }
  }

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!project) return

    try {
      await deleteProjectMutation.mutateAsync(project.id)
      setShowDeleteModal(false)
      // Navigate back to feed after successful deletion
      if (onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  // Handle delete modal close
  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  // Handle edit button click
  const handleEditClick = () => {
    setShowEditModal(true)
  }

  // Handle edit save
  const handleEditSave = async (updatedData) => {
    if (!project) return

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        updates: updatedData
      })
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  // Handle edit modal close
  const handleEditCancel = () => {
    setShowEditModal(false)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load activity</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  // No activity found
  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Activity not found</h3>
          <p className="text-gray-600">The activity you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Back Button - Only in drawer mode */}
      {isDrawer && (
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Feed</span>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4 lg:p-6">
        {/* Stacked Layout Container */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* Top Row: Activity Info, Title, Links, and Action Buttons */}
          <div className="flex-shrink-0">
            {/* Activity Info with Links Section */}
            <div className="flex flex-col sm:flex-row justify-start items-start mb-4 gap-24">
              {/* Left Section: Activity Info */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-lg">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted on {formatDate(project.created_at)}</p>
                  {project.openings && project.openings > 0 && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-md">
                        Looking for {project.openings} Members
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section: Project Links */}
              <div className="flex flex-col space-y-2">
                {/* Project Links Section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Project Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Get all links (new links array or fallback to old link field) */}
                    {(() => {
                      // Use links array if available, otherwise fallback to single link field
                      const allLinks = project.links || (project.link ? [project.link] : []);
                      
                      if (allLinks.length === 0) {
                        return <p className="text-xs text-gray-500 italic">No project links available</p>;
                      }
                      
                      return allLinks.map((link, index) => {
                        const isEmail = link.includes('@');
                        const isDiscord = link.includes('discord');
                        const isGitHub = link.includes('github');
                        
                        return (
                          <a 
                            key={index}
                            href={isEmail ? `mailto:${link}` : link} 
                            target={isEmail ? "_self" : "_blank"} 
                            rel={isEmail ? "" : "noopener noreferrer"}
                            className={`inline-flex items-center px-2 py-1 text-white rounded text-xs transition-colors ${
                              isEmail 
                                ? 'bg-blue-500 hover:bg-blue-600' 
                                : isDiscord 
                                ? 'bg-indigo-500 hover:bg-indigo-600'
                                : isGitHub 
                                ? 'bg-gray-800 hover:bg-gray-900'
                                : 'bg-gray-500 hover:bg-gray-600'
                            }`}
                          >
                            {isEmail ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                              </>
                            ) : isDiscord ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                                Discord
                              </>
                            ) : isGitHub ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Link
                              </>
                            )}
                          </a>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

            {/* Action Buttons - Responsive Layout */}
            {/* Large screens: View Full Page first, Save+Comment together */}
            <div className="hidden lg:flex flex-wrap gap-2">
              {/* View Full Page Button - Primary action */}
              {onNavigateToActivity && (
                <button
                  onClick={() => {
                    // Track this activity in recently viewed
                    if (onAddToRecent) {
                      onAddToRecent(project)
                    }
                    onNavigateToActivity(project.id, origin)
                  }}
                  className="whitespace-nowrap flex-shrink-0 min-w-max px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  View Full Page
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
              
              {/* Save and Comment - Always together */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSaved 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Small screens: Stacked layout */}
            <div className="lg:hidden space-y-2">
              {/* Row 1: View Full Page Button - Primary action */}
              {onNavigateToActivity && (
                <button
                  onClick={() => {
                    // Track this activity in recently viewed
                    if (onAddToRecent) {
                      onAddToRecent(project)
                    }
                    onNavigateToActivity(project.id, origin)
                  }}
                  className="w-full whitespace-nowrap flex-shrink-0 min-w-max px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  View Full Page
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
              
              {/* Row 2: Save and Comment together */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSaved 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Owner Edit/Delete Buttons - Below main action buttons */}
            {user?.id === project.ownerId && (
              <div className="pt-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Activity
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Second Row: Scrollable Activity Description and Team */}
          <div className="flex-1 min-h-0 w-full">
            <div className="bg-white rounded p-4 h-full w-full max-h-[400px] overflow-y-auto border-t-2 border-b-2 border-gray-100">
              <div className="sticky top-0 bg-white pb-2 mb-1">
                <h2 className="text-xl font-semibold text-gray-900">Activity Preview</h2>
                <p className="text-sm text-gray-500">Apply by clicking View Full Page above</p>
              </div>
              
              {/* Description with Read More functionality */}
              <div className="mb-6">
                {(() => {
                  const description = project.description || 'No description provided.'
                  const maxLength = 200
                  const isLong = description.length > maxLength
                  
                  if (!isLong || isDescriptionExpanded) {
                    return (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {description}
                      </p>
                    )
                  } else {
                    return (
                      <div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {description.substring(0, maxLength)}...
                        </p>
                        <button
                          onClick={() => setIsDescriptionExpanded(true)}
                          className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                          Read More
                        </button>
                      </div>
                    )
                  }
                })()}
                
                {isDescriptionExpanded && (() => {
                  const description = project.description || 'No description provided.'
                  const maxLength = 200
                  const isLong = description.length > maxLength
                  
                  if (isLong) {
                    return (
                      <button
                        onClick={() => setIsDescriptionExpanded(false)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        Show Less
                      </button>
                    )
                  }
                  return null
                })()}
              </div>
              
              {/* Team Section */}
              {project.teamRoster && Object.keys(project.teamRoster).length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">Team Members ({Object.keys(project.teamRoster).length})</h3>
                      {/* Membership Status Indicator */}
                      {user?.id && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.ownerId === user.id
                            ? 'bg-purple-100 text-purple-800' 
                            : project.teamRoster && Object.keys(project.teamRoster).includes(user.id)
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.ownerId === user.id 
                            ? 'Owner' 
                            : project.teamRoster && Object.keys(project.teamRoster).includes(user.id)
                              ? 'Member' 
                              : 'Not a member'}
                        </span>
                      )}
                    </div>
                    {/* Leave Team Button - Always show for testing */}
                    {user?.id && (
                      <button
                        onClick={handleLeaveTeam}
                        disabled={isLeaving}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLeaving ? 'Leaving...' : 'Leave Team'}
                      </button>
                    )}
                  </div>
                  
                  {/* Team Error Message */}
                  {teamError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">{teamError}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {Object.entries(project.teamRoster).map(([userId, role]) => {
                      const isCurrentUser = user?.id === userId
                      const isOwner = project.ownerId === userId
                      return (
                        <TeamMemberCard
                          key={userId}
                          userId={userId}
                          role={role}
                          isCurrentUser={isCurrentUser}
                          isOwner={isOwner}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        project={project}
        isDeleting={deleteProjectMutation.isPending}
      />

      {/* Activity Editor Modal */}
      <ActivityEditor
        isOpen={showEditModal}
        onClose={handleEditCancel}
        project={project}
        onSave={handleEditSave}
      />

    </div>
  )
}

export default PostDetail
