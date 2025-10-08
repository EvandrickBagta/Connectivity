import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const Navbar = ({ currentPage, onNavigateToLanding, onNavigateToExplore, onNavigateToProfile, onNavigateToYourProjects }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Connectivity</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={onNavigateToLanding}
              className={`px-3 py-2 text-sm font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-gray-200 hover:after:w-full hover:after:bg-gray-400 after:transition-all after:duration-300 hover:scale-105 ${
                currentPage === 'landing' 
                  ? 'text-gray-900 after:w-full after:bg-gray-400' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button 
              onClick={onNavigateToExplore}
              className={`px-3 py-2 text-sm font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-gray-200 hover:after:w-full hover:after:bg-gray-400 after:transition-all after:duration-300 hover:scale-105 ${
                currentPage === 'explore' 
                  ? 'text-gray-900 after:w-full after:bg-gray-400' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Explore Activities
            </button>
            <button 
              onClick={onNavigateToYourProjects}
              className={`px-3 py-2 text-sm font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-gray-200 hover:after:w-full hover:after:bg-gray-400 after:transition-all after:duration-300 hover:scale-105 ${
                currentPage === 'your-projects' 
                  ? 'text-gray-900 after:w-full after:bg-gray-400' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Your Activities
            </button>
            <button 
              onClick={onNavigateToProfile}
              className={`px-3 py-2 text-sm font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-gray-200 hover:after:w-full hover:after:bg-gray-400 after:transition-all after:duration-300 hover:scale-105 ${
                currentPage === 'profile' 
                  ? 'text-gray-900 after:w-full after:bg-gray-400' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
          </nav>
          
          {/* Google Sign In */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
