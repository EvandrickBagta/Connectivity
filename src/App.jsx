import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'
import About from './pages/About'
import YourProjects from './pages/YourProjects'
import Navbar from './components/Navbar'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const navigateToExplore = () => setCurrentPage('explore')
  const navigateToLanding = () => setCurrentPage('landing')
  const navigateToAbout = () => setCurrentPage('about')
  const navigateToYourProjects = () => setCurrentPage('your-projects')

  return (
    <div>
      {/* Shared Navbar */}
      <Navbar 
        currentPage={currentPage}
        onNavigateToLanding={navigateToLanding}
        onNavigateToExplore={navigateToExplore}
        onNavigateToAbout={navigateToAbout}
        onNavigateToYourProjects={navigateToYourProjects}
      />
      
      {/* Main Content */}
      <main>
        {currentPage === 'explore' ? (
          <Explore />
        ) : currentPage === 'about' ? (
          <About />
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
