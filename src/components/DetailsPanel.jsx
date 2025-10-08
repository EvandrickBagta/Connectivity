import React from 'react'
import PostDetail from './PostDetail'

const DetailsPanel = ({ selectedPostId, onBack, onApply, onSave, onComment, isDrawer = false }) => {
  if (!selectedPostId) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          {/* Placeholder Illustration */}
          <div className="mb-6">
            <svg 
              className="mx-auto h-24 w-24 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
          
          {/* Placeholder Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select an activity to view details
          </h3>
          <p className="text-gray-600 max-w-md">
            Choose an activity from the feed on the left to see its full description, 
            team requirements, and other details here.
          </p>
          
          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">What you'll see:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete activity description</li>
              <li>• Team size and roles needed</li>
              <li>• Author information and contact</li>
              <li>• Apply, save, and comment options</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <PostDetail 
        postId={selectedPostId}
        onBack={onBack}
        onApply={onApply}
        onSave={onSave}
        onComment={onComment}
        isDrawer={isDrawer}
      />
    </div>
  )
}

export default DetailsPanel
