import React, { useState, useEffect } from 'react'
import FeedPanel from '../components/FeedPanel'
import DetailsPanel from '../components/DetailsPanel'
import AddProjectModal from '../components/AddProjectModal'
import RecentlyViewedBar from '../components/RecentlyViewedBar'
import { supabase } from '../lib/supabaseClient'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { useSavedActivities } from '../hooks/useSavedActivities'
import { useProjectById } from '../hooks/useProjects'

// Main Explore component
const Explore = ({ onNavigateToLanding, onNavigateToActivity, origin = 'explore', isActive = true }) => {
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Recently viewed hook
  const { recentActivities, addToRecent, clearRecent } = useRecentlyViewed()
  
  // Saved activities hook
  const { savedActivities, addToSaved, removeFromSaved, clearSaved, isSaved } = useSavedActivities()

  // Initialize selected activity from URL on component mount AND when URL changes
  useEffect(() => {
    const checkUrlForActivity = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const activityId = urlParams.get('activity')
      
      if (activityId && activityId !== selectedPostId) {
        console.log('📌 Restoring selected activity from URL:', activityId)
        setSelectedPostId(activityId)
        setShowDetails(true)
      } else if (!activityId && selectedPostId) {
        // URL doesn't have activity param but we have one selected
        // This can happen when navigating to other tabs
        console.log('📌 Clearing selection (no activity in URL)')
      }
    }
    
    // Check on mount
    checkUrlForActivity()
    
    // Listen for URL changes (when coming back from activity page or using browser navigation)
    const handlePopState = () => {
      console.log('📌 URL changed, checking for activity parameter')
      checkUrlForActivity()
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selectedPostId])

  // Check URL when component becomes active (tab switches back to explore)
  // Only restore from URL if we have an activity parameter
  // Otherwise preserve the current selection (for tab switching within Home)
  useEffect(() => {
    if (isActive) {
      const urlParams = new URLSearchParams(window.location.search)
      const activityId = urlParams.get('activity')
      
      if (activityId && activityId !== selectedPostId) {
        console.log('📌 Restoring selected activity from URL:', activityId)
        setSelectedPostId(activityId)
        setShowDetails(true)
      }
      // Don't clear selection if URL doesn't have activity param
      // This preserves selection when switching between Home tabs
    }
  }, [isActive])

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
    console.log('📌 Selecting activity:', postId)
    setSelectedPostId(postId)
    setShowDetails(true)
    
    // Update URL to remember selected activity
    const url = new URL(window.location)
    url.searchParams.set('activity', postId)
    window.history.replaceState({}, '', url) // Use replaceState to not clutter history
  }

  // Handle back to feed (mobile)
  const handleBackToFeed = () => {
    setShowDetails(false)
    setSelectedPostId(null)
    
    // Clear activity from URL
    const url = new URL(window.location)
    url.searchParams.delete('activity')
    window.history.pushState({}, '', url)
  }

  // Handle selecting a recent activity
  const handleSelectRecent = (activityId) => {
    console.log('📚 Selecting from recent:', activityId)
    handleSelectPost(activityId)
  }

  // Handle selecting a saved activity
  const handleSelectSaved = (activityId) => {
    console.log('💾 Selecting from saved:', activityId)
    handleSelectPost(activityId)
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
    
    if (isSaved(project.id)) {
      removeFromSaved(project.id)
      console.log('Removed from saved:', project.title)
    } else {
      addToSaved(project)
      console.log('Added to saved:', project.title)
    }
  }

  // Handle share (no longer needed as it's handled in PostDetail)
  // const handleShare = (project) => {
  //   console.log('Share project:', project.title)
  // }

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
              onNavigateToActivity={onNavigateToActivity}
              origin={origin}
              recentActivities={recentActivities}
              onSelectRecent={handleSelectRecent}
              onClearRecent={clearRecent}
              savedActivities={savedActivities}
              onSelectSaved={handleSelectSaved}
              onClearSaved={clearSaved}
            />
          </div>
          
          {/* Right Panel - Details (40%) */}
          <div className="w-2/5 overflow-hidden">
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onNavigateToActivity={onNavigateToActivity}
              origin={origin}
              onAddToRecent={addToRecent}
              isSaved={selectedPostId ? isSaved(selectedPostId) : false}
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
              onNavigateToActivity={onNavigateToActivity}
              origin={origin}
              recentActivities={recentActivities}
              onSelectRecent={handleSelectRecent}
              onClearRecent={clearRecent}
              savedActivities={savedActivities}
              onSelectSaved={handleSelectSaved}
              onClearSaved={clearSaved}
            />
          </div>
          
          {/* Right Panel - Details (50%) */}
          <div className="w-1/2 overflow-hidden">
            <DetailsPanel 
              selectedPostId={selectedPostId}
              onBack={handleBackToFeed}
              onApply={handleApply}
              onSave={handleSave}
              onNavigateToActivity={onNavigateToActivity}
              origin={origin}
              onAddToRecent={addToRecent}
              isSaved={selectedPostId ? isSaved(selectedPostId) : false}
            />
          </div>
        </div>

        {/* Small screens: Feed only with drawer */}
        <div className="sm:hidden h-full">
          {/* Feed View */}
          <FeedPanel 
            onSelectPost={handleSelectPost}
            onAddProject={() => setShowAddModal(true)}
            onNavigateToActivity={onNavigateToActivity}
            origin={origin}
            recentActivities={recentActivities}
            onSelectRecent={handleSelectRecent}
            onClearRecent={clearRecent}
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
                  isDrawer={true}
                  onNavigateToActivity={onNavigateToActivity}
                  origin={origin}
                  onAddToRecent={addToRecent}
              isSaved={selectedPostId ? isSaved(selectedPostId) : false}
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

export default Explore
