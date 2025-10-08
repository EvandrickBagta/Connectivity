import React from 'react'

const PostCard = ({ project, currentUserId, onDelete, onEdit }) => {
  // Use the ownerDisplayName directly from the project data
  const ownerDisplayName = project.ownerDisplayName || 'Unknown User'

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getTagColor = (tag, index) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800', 
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    // Use a combination of tag content and index for consistent but varied colors
    const colorIndex = (tag.length + index) % colors.length
    return colors[colorIndex]
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

  // Get user role and ownership status
  const isOwner = project.ownerId === currentUserId
  const teamRosterArray = Array.isArray(project.teamRoster) 
    ? project.teamRoster 
    : Object.entries(project.teamRoster || {}).map(([userId, role]) => ({ userId, role }))
  const userEntry = teamRosterArray.find(m => m.userId === currentUserId)
  const userRole = userEntry?.role ?? null

  // Get team size
  const teamSize = project.teamIds?.length || teamRosterArray?.length || 0

  const handleCardClick = () => {
    if (isOwner && onEdit) {
      onEdit(project)
    }
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col ${
        isOwner && onEdit ? 'cursor-pointer' : ''
      }`}
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-6 pb-4 flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-base">
                {project.title.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-sm text-gray-500 mb-0 gap-0 lg:gap-0">
                <div className="flex gap-x-6 gap-y-0 flex-wrap">
                  <div className="flex items-center space-x-1">
                    <span>👤</span>
                    <span className="truncate">{ownerDisplayName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>👥</span>
                    <span>{teamSize} member{teamSize !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-1">
                {project.openings && project.openings > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-md">
                      Looking for {project.openings} Members
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(project.created_at)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Activity</span>
                    <span className="text-sm text-gray-500">{formatDate(project.created_at)}</span>
                  </div>
                )}
              </h3>
            </div>
          </div>
        </div>


        {/* Project Title and Description */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <p className="text-gray-600 line-clamp-2">{project.description || 'No description provided.'}</p>
        </div>

        {/* Role Pills and Actions */}
        {currentUserId && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {isOwner && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Owner
                </span>
              )}
              {userRole && !isOwner && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {userRole}
                </span>
              )}
            </div>
            
            {/* Delete Button for Owners */}
            {isOwner && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Delete activity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tags Footer */}
      {project.tags && project.tags.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span 
                key={index}
                className={`px-3 py-1 ${getTagColor(tag, index)} text-sm font-medium rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
