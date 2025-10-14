import React from 'react'

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '',
  showAvatar = false,
  showLines = 3 
}) => {
  const renderSkeletonCard = () => (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        {showLines > 3 && (
          <>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )

  const renderSkeletonList = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  )

  const renderSkeletonText = () => (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: showLines }).map((_, index) => (
        <div 
          key={index} 
          className={`h-4 bg-gray-200 rounded ${
            index === showLines - 1 ? 'w-1/2' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  )

  const renderSkeletonButton = () => (
    <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24"></div>
  )

  const renderSkeletonAvatar = () => (
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
  )

  if (type === 'card') {
    return count > 1 ? (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{renderSkeletonCard()}</div>
        ))}
      </div>
    ) : renderSkeletonCard()
  }

  if (type === 'list') {
    return renderSkeletonList()
  }

  if (type === 'text') {
    return renderSkeletonText()
  }

  if (type === 'button') {
    return renderSkeletonButton()
  }

  if (type === 'avatar') {
    return renderSkeletonAvatar()
  }

  return renderSkeletonCard()
}

export default SkeletonLoader
