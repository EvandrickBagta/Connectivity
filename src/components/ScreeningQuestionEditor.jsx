import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import FormSandbox from './FormSandbox'
import ScreeningFormRenderer from './ScreeningFormRenderer'
import Toast from './Toast'

const ScreeningQuestionEditor = ({ activityId, questions = [], onSave, onPreview }) => {
  const { user } = useUser()
  
  // Default questions for demonstration
  const defaultQuestions = [
    {
      id: '1',
      question_text: 'Are you a UCD student?',
      question_type: 'yes_no',
      is_required: true,
      order_index: 1,
      validation_rules: {},
      conditional_logic: {},
      options: []
    },
    {
      id: '2',
      question_text: 'If you are a UCD student, what year are you in?',
      question_type: 'multiple_choice',
      is_required: true,
      order_index: 2,
      validation_rules: {},
      conditional_logic: {},
      options: ['Freshman', 'Sophomore', 'Junior', 'Senior']
    },
    {
      id: '3',
      question_text: 'What would you like to be called?',
      question_type: 'text',
      is_required: true,
      order_index: 3,
      validation_rules: { min_length: 2, max_length: 50 },
      conditional_logic: {},
      options: []
    }
  ]
  
  const [localQuestions, setLocalQuestions] = useState(questions.length > 0 ? questions : defaultQuestions)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const handleAddQuestion = (newQuestion) => {
    setLocalQuestions(prev => [...prev, newQuestion])
  }

  const handleUpdateQuestion = (questionId, updates) => {
    setLocalQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, ...updates }
          : q
      )
    )
  }

  const handleDeleteQuestion = (questionId) => {
    setLocalQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const handleReorderQuestions = (updatedQuestions) => {
    setLocalQuestions(updatedQuestions)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to save questions
      console.log('Saving questions:', localQuestions)
      if (onSave) {
        await onSave(localQuestions)
      }
      
      // Show success toast
      setToast({
        isVisible: true,
        message: `Screening questions saved! ${localQuestions.length} questions configured.`,
        type: 'success'
      })
    } catch (error) {
      console.error('Failed to save questions:', error)
      setToast({
        isVisible: true,
        message: 'Failed to save questions. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />
      
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Screening Questions Editor</h2>
              <p className="text-gray-600 mt-1">
                Create custom screening questions to evaluate applicants
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Questions'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {isPreviewMode ? (
            <ScreeningFormRenderer 
              questions={localQuestions}
              onSubmit={(data) => console.log('Preview submission:', data)}
              onSaveDraft={(data) => console.log('Preview draft:', data)}
              isPreview={true}
            />
          ) : (
            <FormSandbox
              questions={localQuestions}
              onAddQuestion={handleAddQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ScreeningQuestionEditor
