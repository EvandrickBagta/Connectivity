import React from 'react'

const QuestionCard = ({ 
  question, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast 
}) => {
  const handleTypeChange = (newType) => {
    const updates = { question_type: newType }
    
    // Set default options for multiple choice
    if (newType === 'multiple_choice') {
      updates.options = ['Option 1', 'Option 2']
    } else {
      updates.options = []
    }
    
    onUpdate(updates)
  }

  const handleQuestionTextChange = (e) => {
    onUpdate({ question_text: e.target.value })
  }

  const handleRequiredChange = (e) => {
    onUpdate({ is_required: e.target.checked })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`]
    onUpdate({ options: newOptions })
  }

  const handleRemoveOption = (index) => {
    const newOptions = (question.options || []).filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-600">
            Question {question.order_index}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-600"
            title="Delete question"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Text Input */}
      <div className="mb-4">
        <input
          type="text"
          value={question.question_text}
          onChange={handleQuestionTextChange}
          placeholder="Enter your question..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Question Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange('text')}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              question.question_type === 'text'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => handleTypeChange('yes_no')}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              question.question_type === 'yes_no'
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✅ Yes/No
          </button>
          <button
            onClick={() => handleTypeChange('multiple_choice')}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              question.question_type === 'multiple_choice'
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            ☑️ Multiple Choice
          </button>
        </div>
      </div>

      {/* Multiple Choice Options */}
      {question.question_type === 'multiple_choice' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="space-y-2">
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id={`required-${question.id}`}
          checked={question.is_required}
          onChange={handleRequiredChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
          This question is required
        </label>
      </div>
    </div>
  )
}

export default QuestionCard
