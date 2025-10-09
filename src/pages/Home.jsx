import React, { useState, useEffect } from 'react'
import Explore from './Explore'
import Profile from './Profile'
import YourProjects from './YourProjects'

const Home = ({ onNavigateToActivity }) => {
  // Initialize tab from URL hash
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'explore' || hash === 'your-activities' || hash === 'profile') {
      return hash
    }
    return 'explore' // Default to explore
  }
  
  const [activeTab, setActiveTab] = useState(getInitialTab)

  const tabs = [
    { id: 'explore', label: 'Explore Activities', component: Explore, origin: 'explore' },
    { id: 'your-activities', label: 'Your Activities', component: YourProjects, origin: 'your-activities' },
    { id: 'profile', label: 'Profile', component: Profile, origin: 'profile' }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]
  const ActiveComponent = activeTabData.component

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getInitialTab()
      if (newTab !== activeTab) {
        setActiveTab(newTab)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [activeTab])

  // Update URL hash when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    window.history.pushState({}, '', `/home#${tabId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Keep all components mounted to preserve state */}
        <div style={{ display: activeTab === 'explore' ? 'block' : 'none' }} key="explore-tab">
          <Explore 
            onNavigateToActivity={onNavigateToActivity}
            origin="explore"
            isActive={activeTab === 'explore'}
          />
        </div>
        <div style={{ display: activeTab === 'your-activities' ? 'block' : 'none' }} key="your-activities-tab">
          <YourProjects 
            onNavigateToActivity={onNavigateToActivity}
            origin="your-activities"
            isActive={activeTab === 'your-activities'}
          />
        </div>
        <div style={{ display: activeTab === 'profile' ? 'block' : 'none' }} key="profile-tab">
          <Profile />
        </div>
      </div>
    </div>
  )
}

export default Home

