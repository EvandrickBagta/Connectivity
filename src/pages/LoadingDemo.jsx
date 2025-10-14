import React, { useState, useEffect } from 'react'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingSpinner from '../components/LoadingSpinner'
import PageTransition from '../components/PageTransition'

const LoadingDemo = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleOverlayDemo = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 2000)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading States & Transitions Demo</h1>
            <p className="text-gray-600">Showcasing skeleton loaders, spinners, and smooth transitions</p>
          </div>

          {/* Skeleton Loaders */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Skeleton Loaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Activity Cards</h3>
                <SkeletonLoader type="card" count={2} showAvatar={true} />
              </div>
              <div>
                <h3 className="font-medium mb-2">User List</h3>
                <SkeletonLoader type="list" count={3} />
              </div>
            </div>
          </div>

          {/* Loading Spinners */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Loading Spinners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-gray-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="md" />
                <p className="text-sm text-gray-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-gray-600 mt-2">Large</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="xl" />
                <p className="text-sm text-gray-600 mt-2">Extra Large</p>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Interactive Demo</h2>
            <div className="space-y-4">
              <button
                onClick={handleOverlayDemo}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Show Overlay Loading
              </button>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {isLoading ? (
                  <div className="space-y-4">
                    <LoadingSpinner size="lg" text="Loading content..." />
                    <SkeletonLoader type="text" showLines={3} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-green-600">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-lg font-medium">Content Loaded!</p>
                    </div>
                    <p className="text-gray-600">This content appeared after a smooth transition.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transition Examples */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Smooth Transitions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  This page demonstrates various loading states and transitions:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li>Skeleton loaders for different content types</li>
                  <li>Loading spinners in various sizes</li>
                  <li>Smooth page transitions</li>
                  <li>Overlay loading states</li>
                  <li>Animated sidebar sections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Loading */}
        {showOverlay && (
          <LoadingSpinner 
            overlay={true} 
            text="Processing your request..." 
            size="lg"
          />
        )}
      </div>
    </PageTransition>
  )
}

export default LoadingDemo
