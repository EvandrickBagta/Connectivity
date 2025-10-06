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
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Large screens (lg+): 60-40 split */}
        <div className="hidden lg:flex h-full">
          {/* Left Panel - Feed (60%) */}
          <div className="w-3/5 border-r border-gray-200 overflow-hidden">
            <FeedPanel 
              onSelectPost={handleSelectPost}
              onAddProject={() => setShowAddModal(true)}
            />
          </div>
          
          {/* Right Panel - Details (40%) */}
          <div className="w-2/5 overflow-hidden">
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          </div>
        </div>

        {/* Medium screens (sm to md): 50-50 split */}
        <div className="hidden sm:flex lg:hidden h-full">
          {/* Left Panel - Feed (50%) */}
          <div className="w-1/2 border-r border-gray-200 overflow-hidden">
            <FeedPanel 
              onSelectPost={handleSelectPost}
              onAddProject={() => setShowAddModal(true)}
            />
          </div>
          
          {/* Right Panel - Details (50%) */}
          <div className="w-1/2 overflow-hidden">
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onComment={handleComment}
            />
          </div>
        </div>

        {/* Small screens: Feed only with drawer */}
        <div className="sm:hidden h-full">
          {/* Feed View */}
          <FeedPanel 
            onSelectPost={handleSelectPost}
            onAddProject={() => setShowAddModal(true)}
          />
          
          {/* Drawer for Details */}
          {showDetails && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
                onClick={handleBackToFeed}
              />
              
              {/* Drawer */}
              <div className="fixed inset-y-0 right-0 w-full sm:w-5/6 bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out animate-in slide-in-from-right">
                <DetailsPanel 
                  selectedPostId={selectedPostId}
                  onBack={handleBackToFeed}
                  onApply={handleApply}
                  onSave={handleSave}
                  onComment={handleComment}
                  isDrawer={true}
                />
              </div>
            </>
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
