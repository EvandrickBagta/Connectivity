import React from 'react'

const PostCard = ({ project }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4 flex-grow">
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
