import React, { useState, useEffect, useRef } from 'react'
import { useProjects, useSearchProjectsByTags } from '../hooks/useProjects'
import PostCard from './PostCard'
import RecentlyViewedBar from './RecentlyViewedBar'
import { useUser } from '@clerk/clerk-react'

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

const FeedPanel = ({ onSelectPost, onAddProject, onNavigateToActivity, origin = 'explore', recentActivities, onSelectRecent, onClearRecent, savedActivities, onSelectSaved, onClearSaved }) => {
  const [search, setSearch] = useState('')
  const [showTagFilter, setShowTagFilter] = useState(false)
  const { user } = useUser()
  
  const debouncedSearch = useDebounce(search, 300)

  const {
    data: projects,
    isLoading,
    error
  } = useProjects()

  // Extract potential tags from search query
  const extractTagsFromSearch = (searchQuery) => {
    if (!searchQuery) return []
    
    // Look for hashtag patterns (#tag) or comma-separated tags
    const hashtagMatches = searchQuery.match(/#[\w-]+/g)
    const commaSeparated = searchQuery.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    
    let tags = []
    
    if (hashtagMatches) {
      tags = hashtagMatches.map(tag => tag.substring(1)) // Remove # prefix
    } else if (commaSeparated.length > 1) {
      tags = commaSeparated
    }
    
    return tags
  }

  // Check if search query contains tag patterns
  const searchTags = extractTagsFromSearch(debouncedSearch)
  const isTagSearch = searchTags.length > 0

  // Use tag search if tags are detected, otherwise use regular search
  const {
    data: tagSearchResults,
    isLoading: isTagSearchLoading,
    error: tagSearchError
  } = useSearchProjectsByTags(searchTags)

  // Handle post selection
  const handlePostClick = (project) => {
    onSelectPost(project.id)
  }

  // Filter projects based on search
  const filteredProjects = (() => {
    if (!debouncedSearch) return projects || []
    
    if (isTagSearch) {
      // Use tag search results
      return tagSearchResults || []
    } else {
      // Use regular text search
      const searchLower = debouncedSearch.toLowerCase()
      return projects?.filter(project => (
        project.title.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower)) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      )) || []
    }
  })()

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Activities</h2>
        
        {/* Search and Add Project */}
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities, tags (#react, #python), or descriptions..."
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
            
            {/* Tag Search Indicator */}
            {isTagSearch && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-indigo-600 font-medium">Searching by tags:</span>
                <div className="flex flex-wrap gap-1">
                  {searchTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Add Project Button */}
          <button
            onClick={onAddProject}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Recently Viewed Bar */}
      <RecentlyViewedBar 
        recentActivities={recentActivities}
        onSelectActivity={onSelectRecent}
        onClear={onClearRecent}
        savedActivities={savedActivities}
        onSelectSaved={onSelectSaved}
        onClearSaved={onClearSaved}
      />

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
        {/* Loading State */}
        {(isLoading || isTagSearchLoading) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {(error || tagSearchError) && (
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
        {!isLoading && !error && !isTagSearchLoading && !tagSearchError && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">Try adjusting your search or add a new activity.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {filteredProjects.map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handlePostClick(project)}
                    className="cursor-pointer"
                  >
                    <PostCard
                      project={project}
                      currentUserId={user?.id}
                      onNavigateToActivity={onNavigateToActivity}
                      origin={origin}
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
