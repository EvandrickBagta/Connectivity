import React from 'react'

const QuestionTypeSelector = ({ onAddQuestion }) => {
  const questionTypes = [
    {
      type: 'text',
      name: 'Text Input',
      description: 'Short text responses',
      icon: '📝',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      type: 'yes_no',
      name: 'Yes/No',
      description: 'Boolean responses',
      icon: '✅',
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    },
    {
      type: 'multiple_choice',
      name: 'Multiple Choice',
      description: 'Single selection from options',
      icon: '☑️',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ]

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-3">Add Question</h4>
      <div className="grid grid-cols-3 gap-2">
        {questionTypes.map((questionType) => (
          <button
            key={questionType.type}
            onClick={() => onAddQuestion(questionType.type)}
            className={`p-3 border rounded-lg text-left transition-all hover:shadow-md ${questionType.color}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{questionType.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{questionType.name}</div>
                <div className="text-xs opacity-75 line-clamp-2">
                  {questionType.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuestionTypeSelector
