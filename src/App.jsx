import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const navigateToExplore = () => setCurrentPage('explore')
  const navigateToLanding = () => setCurrentPage('landing')

  if (currentPage === 'explore') {
    return <Explore onNavigateToLanding={navigateToLanding} />
  }

  return (
    <LandingPage onNavigateToExplore={navigateToExplore} />
  )
}

export default App
