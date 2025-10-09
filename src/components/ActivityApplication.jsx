import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import ScreeningFormRenderer from './ScreeningFormRenderer'

const ActivityApplication = ({ activity }) => {
  const { user } = useUser()
  const [applicationData, setApplicationData] = useState({
    motivation: '',
    relevantExperience: '',
    availability: '',
    additionalInfo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Mock screening questions - in real implementation, this would come from the database
  const screeningQuestions = activity?.screeningQuestions || [
    {
      id: '1',
      question_text: 'Why do you want to join this activity?',
      question_type: 'textarea',
      is_required: true,
      order_index: 1,
      validation_rules: { min_length: 50, max_length: 1000 },
      conditional_logic: {},
      options: []
    },
    {
      id: '2',
      question_text: 'What is your experience level with this technology?',
      question_type: 'multiple_choice',
      is_required: true,
      order_index: 2,
      validation_rules: {},
      conditional_logic: {},
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      id: '3',
      question_text: 'Are you available for weekly meetings?',
      question_type: 'yes_no',
      is_required: true,
      order_index: 3,
      validation_rules: {},
      conditional_logic: {},
      options: []
    },
    {
      id: '4',
      question_text: 'Rate your interest in this project (1-5 stars)',
      question_type: 'rating',
      is_required: true,
      order_index: 4,
      validation_rules: {},
      conditional_logic: {},
      options: []
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Implement application submission logic
    console.log('Application submitted:', applicationData)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Application submitted successfully!')
    }, 1000)
  }

  const handleAutoFill = () => {
    // TODO: Auto-fill from user profile
    setApplicationData({
      motivation: 'I am passionate about this field and would love to contribute...',
      relevantExperience: 'I have experience in...',
      availability: 'I am available...',
      additionalInfo: 'Additional information...'
    })
  }

  // If custom screening questions exist, use the dynamic form renderer
  if (screeningQuestions.length > 0) {
    return (
      <ScreeningFormRenderer
        questions={screeningQuestions}
        onSubmit={handleSubmit}
        onSaveDraft={(data) => {
          console.log('Saving draft:', data)
          // TODO: Implement draft saving
        }}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Apply to {activity?.title}</h2>
          <p className="text-gray-600 mb-6">
            Complete the application form below to apply for this activity. 
            Make sure to provide detailed information about your motivation and relevant experience.
          </p>
          
          {/* Auto-fill button */}
          <button
            onClick={handleAutoFill}
            className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Auto-fill from Profile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Motivation */}
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to join this activity? *
            </label>
            <textarea
              id="motivation"
              name="motivation"
              value={applicationData.motivation}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Explain your motivation for joining this activity..."
              required
            />
          </div>

          {/* Relevant Experience */}
          <div>
            <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Experience *
            </label>
            <textarea
              id="relevantExperience"
              name="relevantExperience"
              value={applicationData.relevantExperience}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your relevant experience and skills..."
              required
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
              Availability *
            </label>
            <textarea
              id="availability"
              name="availability"
              value={applicationData.availability}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="When are you available to participate?"
              required
            />
          </div>

          {/* Additional Information */}
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={applicationData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          {/* Application Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600">Draft - Ready to submit</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !applicationData.motivation.trim() || !applicationData.relevantExperience.trim() || !applicationData.availability.trim()}
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

export default ActivityApplication
