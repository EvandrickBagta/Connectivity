import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import Explore from './pages/Explore'
import UserSearch from './pages/UserSearch'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import YourProjects from './pages/YourProjects'
import ActivityPage from './pages/ActivityPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import PageTransition from './components/PageTransition'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [activityId, setActivityId] = useState(null)
  const [activityOrigin, setActivityOrigin] = useState('explore')

  // Initialize page from URL on component mount
  useEffect(() => {
    const initializePageFromUrl = () => {
      const path = window.location.pathname
      const hash = window.location.hash
      const historyState = window.history.state
      
      console.log('🔍 Initializing page from URL:', { path, hash, historyState })
      
      // Check for activity page: /activity/:id
      const activityMatch = path.match(/^\/activity\/([^/]+)/)
      if (activityMatch) {
        const id = activityMatch[1]
        const origin = historyState?.origin || 'explore'
        console.log('📍 Setting page to activity:', { id, origin })
        setActivityId(id)
        setActivityOrigin(origin)
        setCurrentPage('activity')
        return
      }
      
      // Check URL path first
      if (path === '/home' || hash === '#home') {
        console.log('📍 Setting page to home')
        setCurrentPage('home')
      } else if (path === '/explore' || hash === '#explore') {
        console.log('📍 Setting page to explore')
        setCurrentPage('explore')
      } else if (path === '/user-search' || hash === '#user-search') {
        console.log('📍 Setting page to user-search')
        setCurrentPage('user-search')
      } else if (path === '/messages' || hash === '#messages') {
        console.log('📍 Setting page to messages')
        setCurrentPage('messages')
      } else if (path === '/profile' || hash === '#profile') {
        console.log('📍 Setting page to profile')
        setCurrentPage('profile')
      } else if (path === '/your-projects' || hash === '#your-projects') {
        console.log('📍 Setting page to your-projects')
        setCurrentPage('your-projects')
      } else {
        console.log('📍 Setting page to landing (default)')
        setCurrentPage('landing')
        // Ensure URL is set to root for landing page
        if (path !== '/' && !hash) {
          window.history.replaceState({}, '', '/')
        }
      }
    }

    initializePageFromUrl()

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      console.log('🔄 Browser navigation detected, reinitializing page')
      initializePageFromUrl()
    }

    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigateToHome = () => {
    console.log('🧭 Navigating to home')
    setCurrentPage('home')
    // Preserve hash and search params if they exist
    const currentUrl = new URL(window.location)
    const hash = currentUrl.hash || '#explore'
    const search = currentUrl.search || ''
    window.history.pushState({}, '', `/home${hash}${search}`)
  }
  
  const navigateToExplore = () => {
    console.log('🧭 Navigating to explore')
    setCurrentPage('explore')
    window.history.pushState({}, '', '/explore')
  }
  
  const navigateToLanding = () => {
    console.log('🧭 Navigating to landing')
    setCurrentPage('landing')
    window.history.pushState({}, '', '/')
  }
  
  const navigateToProfile = () => {
    console.log('🧭 Navigating to profile')
    setCurrentPage('profile')
    window.history.pushState({}, '', '/profile')
  }
  
  const navigateToMessages = () => {
    console.log('🧭 Navigating to messages')
    setCurrentPage('messages')
    window.history.pushState({}, '', '/messages')
  }
  
  const navigateToYourProjects = () => {
    console.log('🧭 Navigating to your-projects')
    setCurrentPage('your-projects')
    window.history.pushState({}, '', '/your-projects')
  }

  const navigateToUserSearch = () => {
    console.log('🧭 Navigating to user-search')
    setCurrentPage('user-search')
    window.history.pushState({}, '', '/user-search')
  }

  const handleSearch = (query) => {
    console.log('🔍 Search query:', query)
    // For now, navigate to explore with search query
    // This could be enhanced to show search results
    setCurrentPage('explore')
    window.history.pushState({}, '', `/explore?search=${encodeURIComponent(query)}`)
  }

  const navigateToActivity = (id, origin = 'explore') => {
    console.log('🧭 Navigating to activity:', { id, origin })
    
    // When viewing full page, save the activity ID we're viewing
    // So when we come back, we can select it again
    const currentActivityId = id
    
    setActivityId(id)
    setActivityOrigin(origin)
    setCurrentPage('activity')
    window.history.pushState({ origin, returnToActivityId: currentActivityId }, '', `/activity/${id}`)
  }

  const navigateBackFromActivity = (origin) => {
    console.log('🧭 Navigating back from activity to:', origin)
    
    // Get the activity ID we want to return to from history state
    const historyState = window.history.state
    const returnToActivityId = historyState?.returnToActivityId
    
    console.log('📌 History state:', historyState)
    console.log('📌 Return to activity ID:', returnToActivityId)
    
    // Navigate to /home with hash for the specific tab
    let hash = ''
    if (origin === 'explore') {
      hash = '#explore'
    } else if (origin === 'your-activities') {
      hash = '#your-activities'
    } else if (origin === 'profile') {
      hash = '#profile'
    }
    
    // Add the activity query param so we can re-select it
    let url = `/home${hash}`
    if (returnToActivityId && origin === 'explore') {
      url += `?activity=${returnToActivityId}`
      console.log('📌 Restoring activity selection:', returnToActivityId)
    }
    
    setCurrentPage('home')
    window.history.pushState({}, '', url)
  }

  console.log('🔍 Current page:', currentPage)
  
  return (
    <div className="min-h-screen">
      {/* Fixed Transparent Navbar */}
          <Navbar />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar - show on all pages */}
        <Sidebar 
          currentPage={currentPage}
          onNavigateToLanding={navigateToLanding}
          onNavigateToHome={navigateToHome}
          onNavigateToMessages={navigateToMessages}
          onNavigateToExplore={navigateToExplore}
          onNavigateToUserSearch={navigateToUserSearch}
          onNavigateToProfile={navigateToProfile}
          onNavigateToYourProjects={navigateToYourProjects}
        />
        
        {/* Main Content */}
        <main className={`flex-1 ml-64 ${currentPage === 'landing' ? '' : 'pt-16'}`}>
          <PageTransition>
            {currentPage === 'activity' ? (
              <ActivityPage 
                activityId={activityId}
                origin={activityOrigin}
                onNavigateBack={navigateBackFromActivity}
              />
            ) : currentPage === 'home' ? (
              <Home 
                onNavigateToActivity={navigateToActivity}
              />
            ) : currentPage === 'explore' ? (
              <Explore 
                onNavigateToActivity={navigateToActivity}
              />
            ) : currentPage === 'user-search' ? (
              <UserSearch />
            ) : currentPage === 'messages' ? (
              <Messages />
            ) : currentPage === 'profile' ? (
              <Profile />
            ) : currentPage === 'your-projects' ? (
              <YourProjects 
                onNavigateToActivity={navigateToActivity}
              />
            ) : (
              <LandingPage 
                onNavigateToHome={navigateToHome} 
                onNavigateToAbout={navigateToLanding}
                currentPage={currentPage}
              />
            )}
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

export default App
