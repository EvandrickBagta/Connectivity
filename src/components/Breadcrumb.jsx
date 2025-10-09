import React from 'react'

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg 
              className="w-4 h-4 text-gray-400 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb

