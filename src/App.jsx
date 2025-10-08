import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import YourProjects from './pages/YourProjects'
import Navbar from './components/Navbar'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  // Initialize page from URL on component mount
  useEffect(() => {
    const initializePageFromUrl = () => {
      const path = window.location.pathname
      const hash = window.location.hash
      
      console.log('🔍 Initializing page from URL:', { path, hash })
      
      // Check URL path first
      if (path === '/explore' || hash === '#explore') {
        console.log('📍 Setting page to explore')
        setCurrentPage('explore')
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
  
  const navigateToYourProjects = () => {
    console.log('🧭 Navigating to your-projects')
    setCurrentPage('your-projects')
    window.history.pushState({}, '', '/your-projects')
  }

  return (
    <div>
      {/* Shared Navbar */}
      <Navbar 
        currentPage={currentPage}
        onNavigateToLanding={navigateToLanding}
        onNavigateToExplore={navigateToExplore}
        onNavigateToProfile={navigateToProfile}
        onNavigateToYourProjects={navigateToYourProjects}
      />
      
      {/* Main Content */}
      <main>
        {currentPage === 'explore' ? (
          <Explore />
        ) : currentPage === 'profile' ? (
          <Profile />
        ) : currentPage === 'your-projects' ? (
          <YourProjects />
        ) : (
          <LandingPage onNavigateToExplore={navigateToExplore} />
        )}
      </main>
    </div>
  )
}

export default App
