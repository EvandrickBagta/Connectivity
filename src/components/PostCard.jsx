import React, { useState } from 'react'

const PostCard = ({ project, onApply, onSave, onComment }) => {
  const [isApplied, setIsApplied] = useState(project.applied)
  const [isSaved, setIsSaved] = useState(project.saved)
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
              {project.author.avatar ? (
                <img 
                  src={project.author.avatar} 
                  alt={project.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-indigo-600 font-semibold text-sm">
                  {getInitials(project.author.name)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{project.author.name}</h3>
              <p className="text-sm text-gray-500">{project.author.major}</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">{formatDate(project.createdAt)}</span>
        </div>

        {/* Project Title and Summary */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <p className="text-gray-600 line-clamp-2">{project.summary}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Roles needed:</span>
            <span className="font-medium text-gray-900">{project.rolesNeeded.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Team size:</span>
            <span className="font-medium text-gray-900">{project.currentTeamSize}/{project.teamSizeNeeded}</span>
          </div>
        </div>

        {/* Applicants count */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            {project.applicants} {project.applicants === 1 ? 'applicant' : 'applicants'}
          </span>
        </div>
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
