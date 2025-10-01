import React, { useState, useEffect, useRef } from 'react'
import { useProjects } from '../hooks/useProjects'
import PostCard from './PostCard'

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Skeleton loader component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
    <div className="p-6 pb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="px-6 py-4 bg-gray-50">
      <div className="flex space-x-3">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
        <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
)

const FeedPanel = ({ onSelectPost, onApply, onSave, onComment }) => {
  const [search, setSearch] = useState('')
  const [showTagFilter, setShowTagFilter] = useState(false)
  
  const debouncedSearch = useDebounce(search, 300)

  const {
    data: projects,
    isLoading,
    error
  } = useProjects()

  // Handle post selection
  const handlePostClick = (project) => {
    onSelectPost(project.id)
  }

  // Filter projects based on search
  const filteredProjects = projects?.filter(project => {
    if (!debouncedSearch) return true
    const searchLower = debouncedSearch.toLowerCase()
    return (
      project.title.toLowerCase().includes(searchLower) ||
      (project.description && project.description.toLowerCase().includes(searchLower))
    )
  }) || []

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Projects</h2>
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600">Failed to load projects. Please try again.</p>
          </div>
        )}

        {/* Projects List */}
        {!isLoading && !error && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try adjusting your search or add a new project.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handlePostClick(project)}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <PostCard
                      project={project}
                      onApply={onApply}
                      onSave={onSave}
                      onComment={onComment}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FeedPanel
