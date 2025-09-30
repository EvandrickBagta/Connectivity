import React, { useState } from 'react'

const PostDetail = ({ postId, onBack, onApply, onSave, onComment }) => {
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // In a real app, this would fetch the post by ID
  // For now, we'll use mock data - in production, this would come from props or API
  const mockPost = {
    id: postId,
    title: 'Campus Gardening App',
    description: 'We are building a comprehensive platform that helps students find gardening spaces, share resources, and learn about sustainable practices. The app will include features like plant identification, watering schedules, and community forums. Our vision is to create a thriving community of student gardeners who can share knowledge, resources, and fresh produce. The platform will feature interactive maps showing available garden plots, a plant care database with personalized recommendations, and a marketplace for trading seeds and tools. We\'re looking for developers with experience in mobile app development, UI/UX designers who understand sustainable design principles, and backend developers who can build scalable systems for community management.',
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      major: 'Computer Science',
      avatar: null
    },
    tags: ['CS', 'Biology', 'Sustainability', 'Mobile'],
    rolesNeeded: ['Frontend Developer', 'UI/UX Designer', 'Backend Developer'],
    teamSizeNeeded: 4,
    currentTeamSize: 1,
    applicants: 12,
    createdAt: '2024-01-15T10:30:00Z',
    saved: false,
    applied: false
  }

  const handleApply = async () => {
    if (isApplied || isApplying) return
    
    setIsApplying(true)
    try {
      await onApply(mockPost)
      setIsApplied(true)
    } catch (error) {
      console.error('Failed to apply:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(mockPost)
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleComment = () => {
    onComment(mockPost)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-gray-200">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            {mockPost.author.avatar ? (
              <img 
                src={mockPost.author.avatar} 
                alt={mockPost.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 font-semibold text-lg">
                {getInitials(mockPost.author.name)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{mockPost.author.name}</h3>
            <p className="text-gray-600">{mockPost.author.major}</p>
            <p className="text-sm text-gray-500">Posted on {formatDate(mockPost.createdAt)}</p>
          </div>
        </div>

        {/* Project Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockPost.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {mockPost.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Team Size</p>
            <p className="text-lg font-semibold text-gray-900">{mockPost.currentTeamSize}/{mockPost.teamSizeNeeded}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Applicants</p>
            <p className="text-lg font-semibold text-gray-900">{mockPost.applicants}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Project Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{mockPost.description}</p>
        </div>

        {/* Roles Needed */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Roles Needed</h2>
          <div className="space-y-2">
            {mockPost.rolesNeeded.map((role, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-700">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApply}
            disabled={isApplied || isApplying}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              isApplied 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : isApplying
                ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isApplying ? 'Applying...' : isApplied ? 'Applied' : 'Apply to Project'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleComment}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
