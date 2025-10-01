import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FeedPanel from '../components/FeedPanel'
import DetailsPanel from '../components/DetailsPanel'
import AddProjectModal from '../components/AddProjectModal'
import { supabase } from '../lib/supabaseClient'

// Create a query client
const queryClient = new QueryClient()

// Main Explore component
const ExploreContent = ({ onNavigateToLanding }) => {
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Test Supabase connection
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        // Test connection by fetching from a projects table
        const { data, error } = await supabase.from('projects').select('*').limit(1);
        
        if (error) {
          console.log('Supabase connection test (expected error - table may not exist):', error.message);
        } else {
          console.log('Supabase connection successful:', data);
        }
      } catch (err) {
        console.log('Supabase connection test failed:', err.message);
      }
    };

    testSupabaseConnection();
  }, []);

  // Handle post selection
  const handleSelectPost = (postId) => {
    setSelectedPostId(postId)
    setShowDetails(true)
  }

  // Handle back to feed (mobile)
  const handleBackToFeed = () => {
    setShowDetails(false)
    setSelectedPostId(null)
  }

  // Handle apply to project
  const handleApply = async (project) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Applied to project:', project.title)
  }

  // Handle save project
  const handleSave = async (project) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Saved project:', project.title)
  }

  // Handle comment
  const handleComment = (project) => {
    console.log('Comment on project:', project.title)
    // In a real app, this would open a comment modal or navigate to project details
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onNavigateToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Landing</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Explore Projects</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: Split Screen */}
        <div className="hidden md:flex h-full">
          {/* Left Panel - Feed */}
          <div className="flex-1 border-r border-gray-200 overflow-hidden">
            <FeedPanel 
              onSelectPost={handleSelectPost}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          </div>
          
          {/* Right Panel - Details */}
          <div className="flex-1 overflow-hidden">
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          </div>
        </div>

        {/* Mobile: Single Column */}
        <div className="md:hidden h-full">
          {!showDetails ? (
            /* Mobile Feed View */
            <FeedPanel 
              onSelectPost={handleSelectPost}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          ) : (
            /* Mobile Details View */
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  )
}

// Wrapper component with QueryClient
const Explore = ({ onNavigateToLanding }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ExploreContent onNavigateToLanding={onNavigateToLanding} />
    </QueryClientProvider>
  )
}

export default Explore
