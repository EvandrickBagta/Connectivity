import React, { useState } from 'react'

const RecentlyViewedBar = ({ recentActivities, onSelectActivity, onClear, savedActivities = [], onSelectSaved, onClearSaved }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('recent') // 'recent' or 'saved'

  if (recentActivities.length === 0 && savedActivities.length === 0) {
    return null // Don't show if no activities
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simplified Header */}
        <div className="py-2">
          <div className="flex items-center justify-between">
            {/* Left: Tabs */}
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab('recent')
                  if (!isExpanded) {
                    setIsExpanded(true)
                  }
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Recent ({recentActivities.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('saved')
                  if (!isExpanded) {
                    setIsExpanded(true)
                  }
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'saved'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Saved ({savedActivities.length})
              </button>
            </div>
            
            {/* Right: Expand/Collapse and Clear */}
            <div className="flex items-center space-x-2">
              {isExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const message = activeTab === 'recent' 
                      ? 'Clear all recently viewed activities?' 
                      : 'Clear all saved activities?'
                    if (window.confirm(message)) {
                      if (activeTab === 'recent') {
                        onClear()
                      } else {
                        onClearSaved()
                      }
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                >
                  Clear
                </button>
              )}
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-2 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-1"
              >
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-sm text-gray-600">
                  {isExpanded ? 'Collapse' : 'Expand'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {activeTab === 'recent' ? (
                recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No recently viewed activities</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => onSelectActivity(activity.id)}
                      className="flex-shrink-0 w-44 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg p-3 transition-all hover:shadow-sm group"
                    >
                      {/* Activity Title */}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 text-left">
                        {activity.title}
                      </h3>

                      {/* Owner and timestamp */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{activity.ownerDisplayName}</span>
                        <span>{formatTimeAgo(activity.viewedAt)}</span>
                      </div>
                    </button>
                  ))
                )
              ) : (
                savedActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <p className="text-sm">No saved activities</p>
                  </div>
                ) : (
                  savedActivities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => onSelectSaved(activity.id)}
                      className="flex-shrink-0 w-44 bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300 rounded-lg p-3 transition-all hover:shadow-sm group"
                    >
                      {/* Activity Title */}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 text-left">
                        {activity.title}
                      </h3>

                      {/* Owner and saved indicator */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{activity.ownerDisplayName}</span>
                        <span className="text-yellow-600 font-medium">Saved</span>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export default RecentlyViewedBar

