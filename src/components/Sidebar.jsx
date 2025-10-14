import React, { useState } from 'react'

const Sidebar = ({ 
  currentPage, 
  onNavigateToLanding, 
  onNavigateToHome, 
  onNavigateToMessages,
  onNavigateToExplore,
  onNavigateToUserSearch,
  onNavigateToProfile,
  onNavigateToYourProjects
}) => {
  console.log('🔍 Sidebar rendering with currentPage:', currentPage)
  const [expandedSections, setExpandedSections] = useState({
    'discover': true,
    'manage': true,
    'connect': true
  })

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const navigationSections = [
    {
      id: 'discover',
      title: 'Discover',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      items: [
        { 
          id: 'explore', 
          label: 'Explore Activities', 
          onClick: onNavigateToExplore,
          isActive: currentPage === 'explore'
        },
        { 
          id: 'user-search', 
          label: 'User Search', 
          onClick: onNavigateToUserSearch,
          isActive: currentPage === 'user-search'
        }
      ]
    },
    {
      id: 'manage',
      title: 'Manage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      items: [
        { 
          id: 'your-projects', 
          label: 'Your Activities', 
          onClick: onNavigateToYourProjects,
          isActive: currentPage === 'your-projects'
        },
        { 
          id: 'profile', 
          label: 'Profile', 
          onClick: onNavigateToProfile,
          isActive: currentPage === 'profile'
        }
      ]
    },
    {
      id: 'connect',
      title: 'Connect',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      items: [
        { 
          id: 'messages', 
          label: 'Messages', 
          onClick: onNavigateToMessages,
          isActive: currentPage === 'messages'
        }
      ]
    },
    {
      id: 'demo',
      title: 'Demo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      items: [
        { 
          id: 'loading-demo', 
          label: 'Loading Demo', 
          onClick: () => window.location.href = '/loading-demo',
          isActive: currentPage === 'loading-demo'
        }
      ]
    }
  ]

  return (
    <div className="w-64 bg-white flex flex-col fixed left-0 top-0 bottom-0">
      {/* Connectivity Badge */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Connectivity</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* About Link */}
        <button
          onClick={onNavigateToLanding}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
            currentPage === 'landing'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About
        </button>

        {/* Home Link */}
        <button
          onClick={onNavigateToHome}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
            currentPage === 'home'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>

        {/* Navigation Sections */}
        {navigationSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Divider with Title - Clickable */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center my-4 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center pl-2 pr-0">
                <div className="p-1 rounded-lg">
                  {section.icon}
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors ml-2">
                  {section.title}
                </span>
                <svg 
                  className={`w-3 h-3 ml-2 transition-all duration-200 ${
                    expandedSections[section.id] ? 'rotate-180 text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-200 ml-2"></div>
            </button>
            
            {/* Section Items - Collapsible */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections[section.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-1 ml-6 pt-2">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group ${
                      item.isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-3 transition-all duration-200 ${
                      item.isActive 
                        ? 'bg-white' 
                        : 'bg-gray-300 group-hover:bg-indigo-400'
                    }`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
