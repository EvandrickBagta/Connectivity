import React, { useState } from 'react'
import { useProjectById } from '../hooks/useProjects'

const PostDetail = ({ postId, onBack, onApply, onSave, onComment, isDrawer = false }) => {
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { data: project, isLoading, error } = useProjectById(postId)

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

  const handleComment = () => {
    if (project) {
      onComment(project)
    }
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
          <p className="text-gray-600">Loading project...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load project</h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }

  // No project found
  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
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
          
          {/* Top Row: Project Info, Title, Links, and Action Buttons */}
          <div className="flex-shrink-0">
            {/* Project Info with Links Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              {/* Left Section: Project Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-lg">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Project</h3>
                  <p className="text-gray-600">Created by user</p>
                  <p className="text-sm text-gray-500">Posted on {formatDate(project.created_at)}</p>
                </div>
              </div>

              {/* Right Section: Links Column */}
              <div className="flex flex-col space-y-2">
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View External Link
                  </a>
                )}
              </div>
            </div>

            {/* Project Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

            {/* Action Buttons - Responsive Layout */}
            {/* Large screens: Apply first, Save+Comment together */}
            <div className="hidden lg:flex flex-wrap gap-2">
              {/* Apply to Project - Always first row */}
              <button
                onClick={handleApply}
                disabled={isApplied || isApplying}
                className={`whitespace-nowrap flex-shrink-0 min-w-max px-4 py-2 rounded-lg font-medium transition-colors ${
                  isApplied 
                    ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                    : isApplying
                    ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply to Project'}
              </button>
              
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
                  onClick={handleComment}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>

            {/* Small screens: Stacked layout */}
            <div className="lg:hidden space-y-2">
              {/* Row 1: Apply to Project */}
              <button
                onClick={handleApply}
                disabled={isApplied || isApplying}
                className={`w-full whitespace-nowrap flex-shrink-0 min-w-max px-4 py-2 rounded-lg font-medium transition-colors ${
                  isApplied 
                    ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                    : isApplying
                    ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply to Project'}
              </button>
              
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
                  onClick={handleComment}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Second Row: Scrollable Project Description */}
          <div className="flex-1 min-h-0 w-full">
            <div className="bg-white rounded p-4 h-full w-full max-h-[400px] overflow-y-auto border-t-2 border-b-2 border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sticky top-0 bg-white pb-2">Project Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description || 'No description provided.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PostDetail
