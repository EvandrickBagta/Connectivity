import React, { useState, useEffect } from 'react'

const ActivityEditor = ({ isOpen, onClose, project, onSave, isInline = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    links: [],
    openings: 0,
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [newLink, setNewLink] = useState('')
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        links: project.links || (project.link ? [project.link] : []),
        openings: project.openings || 0,
        tags: project.tags || []
      })
    }
  }, [project])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (newLink.trim() && !formData.links.includes(newLink.trim())) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()]
      }))
      setNewLink('')
    }
  }

  const handleRemoveLink = (linkToRemove) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter(link => link !== linkToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    // Validate links
    for (const link of formData.links) {
      if (!isValidUrl(link) && !isValidEmail(link)) {
        newErrors.links = 'Please enter valid URLs or email addresses'
        break
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Set saving state
    setIsSaving(true)
    setErrors({})

    try {
      // Call save function and wait for it to complete
      await onSave({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        links: formData.links
      })
    } catch (error) {
      console.error('Failed to save changes:', error)
      setErrors({ general: 'Failed to save changes. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const isValidEmail = (string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(string)
  }

  if (!isOpen) return null

  // Inline mode - render without modal wrapper
  if (isInline) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Activity Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter activity title"
            maxLength={100}
            required
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe your activity"
            maxLength={500}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Links
          </label>
          <div className="space-y-2">
            {formData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => {
                    const newLinks = [...formData.links]
                    newLinks[index] = e.target.value
                    setFormData(prev => ({ ...prev, links: newLinks }))
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter URL or email"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddLink(e)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add new link"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          {errors.links && (
            <p className="text-red-600 text-sm mt-1">{errors.links}</p>
          )}
        </div>

        {/* Openings */}
        <div>
          <label htmlFor="openings" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Openings
          </label>
          <input
            type="number"
            id="openings"
            name="openings"
            value={formData.openings}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="How many people are you looking for?"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add new tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !formData.title.trim()}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    )
  }

  // Modal mode - render with modal wrapper
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Activity</h2>
              <p className="text-gray-600">Update your activity information</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter activity title"
                maxLength={100}
                required
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your activity"
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Links
              </label>
              <div className="space-y-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...formData.links]
                        newLinks[index] = e.target.value
                        setFormData(prev => ({ ...prev, links: newLinks }))
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter URL or email"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink(e)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add new link"
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              {errors.links && (
                <p className="text-red-600 text-sm mt-1">{errors.links}</p>
              )}
            </div>

            {/* Openings */}
            <div>
              <label htmlFor="openings" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Openings
              </label>
              <input
                type="number"
                id="openings"
                name="openings"
                value={formData.openings}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="How many people are you looking for?"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add new tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !formData.title.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ActivityEditor