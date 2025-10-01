import React, { useState } from 'react'

const PostCard = ({ project, onApply, onSave, onComment }) => {
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleApply = async () => {
    if (isApplied || isApplying) return
    
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
    onComment(project)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {project.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Project</h3>
              <p className="text-sm text-gray-500">Created by user</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">{formatDate(project.created_at)}</span>
        </div>

        {/* Project Title and Description */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <p className="text-gray-600 line-clamp-2">{project.description || 'No description provided.'}</p>
        </div>

        {/* Link if available */}
        {project.link && (
          <div className="mb-4">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Project Link →
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex space-x-3">
          <button
            onClick={handleApply}
            disabled={isApplied || isApplying}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              isApplied 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : isApplying
                ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            aria-label={isApplied ? 'Applied to project' : 'Apply to project'}
          >
            {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save project'}
          >
            {isSaving ? '...' : isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleComment}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            aria-label="Comment on project"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
