import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

const ScreeningFormRenderer = ({ questions, onSubmit, onSaveDraft, isPreview = false }) => {
  const { user } = useUser()
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  // Calculate progress based on completed required fields
  useEffect(() => {
    const requiredQuestions = questions.filter(q => q.is_required)
    const completedRequired = requiredQuestions.filter(q => {
      const value = formData[q.id]
      return value !== undefined && value !== null && value !== ''
    })
    const progressPercentage = requiredQuestions.length > 0 
      ? (completedRequired.length / requiredQuestions.length) * 100 
      : 0
    setProgress(progressPercentage)
  }, [formData, questions])

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    questions.forEach(question => {
      if (question.is_required) {
        const value = formData[question.id]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[question.id] = 'This field is required'
        } else if (question.validation_rules) {
          const rules = question.validation_rules
          if (rules.min_length && value.length < rules.min_length) {
            newErrors[question.id] = `Minimum ${rules.min_length} characters required`
          }
          if (rules.max_length && value.length > rules.max_length) {
            newErrors[question.id] = `Maximum ${rules.max_length} characters allowed`
          }
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft(formData)
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  const renderQuestion = (question) => {
    const value = formData[question.id] || ''
    const error = errors[question.id]

    switch (question.question_type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your answer..."
          />
        )


      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'yes_no':
        return (
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={value === 'yes'}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={value === 'no'}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        )


      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your answer..."
          />
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isPreview ? 'Application Form Preview' : 'Application Form'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isPreview 
              ? 'This is how applicants will see the form'
              : 'Complete the application form below to apply for this activity.'
            }
          </p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions
            .sort((a, b) => a.order_index - b.order_index)
            .map((question) => (
              <div key={question.id} className="border-b border-gray-200 pb-6">
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-900 mb-2">
                    {question.question_text}
                    {question.is_required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {question.validation_rules && (
                    <div className="text-sm text-gray-500 mb-2">
                      {question.validation_rules.min_length && (
                        <span>Min: {question.validation_rules.min_length} characters</span>
                      )}
                      {question.validation_rules.min_length && question.validation_rules.max_length && (
                        <span> • </span>
                      )}
                      {question.validation_rules.max_length && (
                        <span>Max: {question.validation_rules.max_length} characters</span>
                      )}
                    </div>
                  )}
                </div>
                
                {renderQuestion(question)}
                
                {errors[question.id] && (
                  <p className="mt-2 text-sm text-red-600">{errors[question.id]}</p>
                )}
              </div>
            ))}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Draft
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || progress < 100}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScreeningFormRenderer
