import React, { useState, useEffect } from 'react'
import Explore from './Explore'
import UserSearch from './UserSearch'
import YourProjects from './YourProjects'
import Profile from './Profile'

const Home = ({ onNavigateToActivity }) => {
  // Initialize tab from URL hash
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'explore' || hash === 'user-search' || hash === 'your-activities' || hash === 'profile') {
      return hash
    }
    return 'explore' // Default to explore
  }
  
  const [activeTab, setActiveTab] = useState(getInitialTab)

  const tabs = [
    { id: 'explore', label: 'Explore Activities', component: Explore, origin: 'explore' },
    { id: 'user-search', label: 'User Search', component: UserSearch, origin: 'user-search' },
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
        <div style={{ display: activeTab === 'user-search' ? 'block' : 'none' }} key="user-search-tab">
          <UserSearch />
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

