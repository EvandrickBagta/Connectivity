import React, { useState } from 'react'
import { useCreateProject } from '../hooks/useProjects'
import { useUser } from '@clerk/clerk-react'
import { useUserProfile } from '../contexts/UserContext'

const AddProjectModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState([])
  const [openings, setOpenings] = useState(0)
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [newLink, setNewLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useUser()
  const { userProfile } = useUserProfile()

  const createProjectMutation = useCreateProject()

  const handleAddTag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newLink.trim() && !links.includes(newLink.trim())) {
      setLinks(prev => [...prev, newLink.trim()])
      setNewLink('')
    }
  }

  const handleRemoveLink = (linkToRemove) => {
    setLinks(prev => prev.filter(link => link !== linkToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('Please enter a project title')
      return
    }

    if (!user) {
      alert('Please sign in to create a project')
      return
    }

    setIsSubmitting(true)
    try {
      await createProjectMutation.mutateAsync({
        projectData: {
          title: title.trim(),
          description: description.trim() || undefined,
          links: links.length > 0 ? links : undefined,
          openings: openings || 0,
          tags: tags.length > 0 ? tags : undefined
        },
        ownerId: user.id,
        ownerDisplayName: userProfile?.display_name || userProfile?.username || user.fullName || user.firstName || 'Unknown User'
      })
      
      // Reset form and close modal
      setTitle('')
      setDescription('')
      setLinks([])
      setOpenings(0)
      setTags([])
      setNewTag('')
      setNewLink('')
      onClose()
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('')
      setDescription('')
      setLinks([])
      setTags([])
      setNewTag('')
      setNewLink('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Add New Activity</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter activity title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={100}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your activity..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Links (Optional)
              </label>
              
              {/* Add New Link */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddLink(e)
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com or email@example.com"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !newLink.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Current Links */}
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {links.map((link, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {link}
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={isSubmitting}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add to add links (websites or emails)
              </p>
            </div>

            <div>
              <label htmlFor="openings" className="block text-sm font-medium text-gray-700 mb-2">
                Openings
              </label>
              <input
                type="number"
                id="openings"
                value={openings}
                onChange={(e) => setOpenings(parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Approximate number of members needed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              
              {/* Add New Tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag(e)
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add a tag..."
                  maxLength={20}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !newTag.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Current Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                        disabled={isSubmitting}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Press Enter or click Add to add tags
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProjectModal
