import React, { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const navigateToExplore = () => setCurrentPage('explore')
  const navigateToLanding = () => setCurrentPage('landing')

  return (
    <div>
      {/* Main Content */}
      <main>
        <SignedIn>
          {currentPage === 'explore' ? (
            <Explore onNavigateToLanding={navigateToLanding} />
          ) : (
            <LandingPage onNavigateToExplore={navigateToExplore} />
          )}
        </SignedIn>
        <SignedOut>
          {currentPage === 'explore' ? (
            <Explore onNavigateToLanding={navigateToLanding} />
          ) : (
            <LandingPage onNavigateToExplore={navigateToExplore} />
          )}
        </SignedOut>
      </main>
    </div>
  )
}

export default App
