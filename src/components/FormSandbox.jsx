import React from 'react'
import QuestionCard from './QuestionCard'

const FormSandbox = ({ 
  questions, 
  onAddQuestion, 
  onUpdateQuestion, 
  onDeleteQuestion, 
  onReorderQuestions 
}) => {
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question_text: '',
      question_type: 'text',
      is_required: true,
      order_index: questions.length + 1,
      validation_rules: {},
      conditional_logic: {},
      options: []
    }
    onAddQuestion(newQuestion)
  }

  const handleMoveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) return
    
    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(fromIndex, 1)
    newQuestions.splice(toIndex, 0, movedQuestion)
    
    // Update order indices
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order_index: index + 1
    }))
    
    onReorderQuestions(updatedQuestions)
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-96 bg-gray-50">
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">No questions yet</p>
          <p className="text-sm text-gray-400 mb-4">Add your first question to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions
            .sort((a, b) => a.order_index - b.order_index)
            .map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                onDelete={() => onDeleteQuestion(question.id)}
                onMoveUp={() => handleMoveQuestion(index, index - 1)}
                onMoveDown={() => handleMoveQuestion(index, index + 1)}
                isFirst={index === 0}
                isLast={index === questions.length - 1}
              />
            ))}
        </div>
      )}
      
      <button 
        onClick={handleAddQuestion}
        className="mt-6 w-full border-2 border-dashed border-gray-400 rounded-lg p-4 text-gray-600 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add a question
        </div>
      </button>
    </div>
  )
}

export default FormSandbox
