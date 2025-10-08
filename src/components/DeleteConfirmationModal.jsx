import React from 'react'

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, project, isDeleting }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Activity</h2>
            <p className="text-gray-600">
              Are you sure you want to delete this activity? This action cannot be undone.
            </p>
          </div>

          {/* Activity Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description || 'No description provided.'}
            </p>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800">Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  This will permanently delete the activity and all associated data. Team members will no longer have access to this activity.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                'Delete Activity'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
