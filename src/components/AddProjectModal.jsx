import React, { useState } from 'react'
import { useAddProject } from '../hooks/useProjects'

const AddProjectModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addProjectMutation = useAddProject()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('Please enter a project title')
      return
    }

    setIsSubmitting(true)
    try {
      await addProjectMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined
      })
      
      // Reset form and close modal
      setTitle('')
      setDescription('')
      setLink('')
      onClose()
    } catch (error) {
      console.error('Failed to add project:', error)
      alert('Failed to add project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('')
      setDescription('')
      setLink('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                Project Link
              </label>
              <input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isSubmitting}
              />
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
                {isSubmitting ? 'Adding...' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProjectModal
