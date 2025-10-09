import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useProjects, useUpdateProject } from '../hooks/useProjects'
import Breadcrumb from '../components/Breadcrumb'
import ActivityOverview from '../components/ActivityOverview'
import ActivityTeam from '../components/ActivityTeam'
import ActivityPosts from '../components/ActivityPosts'
import ActivityApplication from '../components/ActivityApplication'
import ActivityEditor from '../components/ActivityEditor'
import ScreeningQuestionEditor from '../components/ScreeningQuestionEditor'
import TeamManagement from '../components/TeamManagement'

const ActivityPage = ({ activityId, origin = 'explore', onNavigateBack }) => {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditMode, setIsEditMode] = useState(false)
  const { data: projects, isLoading, error } = useProjects()
  const updateProjectMutation = useUpdateProject()

  // Find the specific activity
  const activity = projects?.find(p => p.id === activityId)
  
  // Check if current user is the owner
  const isOwner = activity?.ownerId === user?.id

  // Handle edit functionality
  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleEditCancel = () => {
    setIsEditMode(false)
  }

  const handleEditSave = async (updatedData) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: activityId,
        ...updatedData
      })
      setIsEditMode(false)
    } catch (error) {
      console.error('Failed to update activity:', error)
      throw error // Re-throw to let ActivityEditor handle the error
    }
  }

  const handleScreeningQuestionsSave = async (questions) => {
    try {
      // TODO: Implement API call to save screening questions
      console.log('Saving screening questions for activity:', activityId, questions)
      // For now, just log the questions
    } catch (error) {
      console.error('Failed to save screening questions:', error)
      throw error
    }
  }

  // Determine origin label for breadcrumb
  const getOriginLabel = () => {
    switch (origin) {
      case 'explore':
        return 'Explore'
      case 'your-activities':
        return 'Your Activities'
      case 'profile':
        return 'Profile'
      default:
        return 'Explore'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', component: ActivityOverview },
    { id: 'team', label: 'Team', component: ActivityTeam },
    { id: 'posts', label: 'Posts', component: ActivityPosts },
    { id: 'application', label: 'Application', component: ActivityApplication },
  ]

  // Add screening editor and team management tabs for activity owners
  const ownerTabs = [
    ...tabs,
    { id: 'screening', label: 'Screening Questions', component: ScreeningQuestionEditor },
    { id: 'manage-team', label: 'Manage Team', component: TeamManagement }
  ]

  // Use appropriate tabs based on user role
  const availableTabs = isOwner ? ownerTabs : tabs
  const ActiveTabComponent = availableTabs.find(tab => tab.id === activeTab)?.component || ActivityOverview

  // Breadcrumb items
  const breadcrumbItems = [
    { 
      label: getOriginLabel(), 
      onClick: () => onNavigateBack(origin) 
    },
    { 
      label: activity?.title || 'Loading...' 
    }
  ]

  // Add Edit breadcrumb if user is owner and in edit mode
  if (isOwner && isEditMode) {
    breadcrumbItems.push({
      label: 'Edit'
    })
  }

  // Level 3 breadcrumb if on a sub-page (but not in edit mode)
  if (activeTab !== 'overview' && !isEditMode) {
    const tabLabel = availableTabs.find(t => t.id === activeTab)?.label || activeTab
    breadcrumbItems.push({
      label: tabLabel
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity...</p>
        </div>
      </div>
    )
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Not Found</h2>
          <p className="text-gray-600 mb-4">This activity doesn't exist or has been removed.</p>
          <button
            onClick={() => onNavigateBack(origin)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Activity Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
              <p className="text-gray-600 mb-4">{activity.description}</p>
              <div className="flex flex-wrap gap-2">
                {activity.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-6 flex gap-3">
              {isOwner && !isEditMode && (
                <button 
                  onClick={handleEditClick}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  Edit Activity
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tabs - Hidden in edit mode */}
      {!isEditMode && (
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Activity tabs">
              {/* Regular tabs */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors relative
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    ${tab.id === 'application' 
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg px-3 -mx-1 border-l border-r border-t border-gray-200 shadow-sm hover:shadow-md' 
                      : ''
                    }
                  `}
                >
                  <span className="flex items-center">
                    {tab.label}
                    {tab.id === 'application' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        EZ Apply
                      </span>
                    )}
                  </span>
                </button>
              ))}

              {/* Admin Tools Container */}
              {isOwner && (
                <>
                  <div className="w-8"></div>
                  <div className="flex items-center bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg px-3 -mx-1 border-l border-r border-t border-orange-200 shadow-sm">
                    <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    
                    {/* Admin tabs inside the container */}
                    {ownerTabs.filter(tab => !tabs.includes(tab)).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          py-2 px-4 border-2 font-medium text-sm transition-all duration-200 relative rounded-lg mx-1
                          ${activeTab === tab.id
                            ? 'border-orange-500 text-orange-700 bg-orange-100 shadow-md ring-2 ring-orange-200'
                            : 'border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm'
                          }
                        `}
                      >
                        <span className="flex items-center">
                          {tab.id === 'screening' && (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {tab.id === 'manage-team' && (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditMode ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Activity</h2>
                <p className="text-gray-600">Update your activity information</p>
              </div>
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            <ActivityEditor
              isOpen={true}
              onClose={handleEditCancel}
              project={activity}
              onSave={handleEditSave}
              isInline={true}
            />
          </div>
        ) : (
          <ActiveTabComponent 
            activity={activity} 
            activityId={activityId}
            onSave={activeTab === 'screening' ? handleScreeningQuestionsSave : undefined}
          />
        )}
      </div>
    </div>
  )
}

export default ActivityPage

