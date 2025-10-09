import React, { useState } from 'react'

const ConditionalLogicBuilder = ({ questions, onLogicChange }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [logicRules, setLogicRules] = useState({})

  const handleAddRule = (questionId) => {
    const newRule = {
      id: Date.now().toString(),
      condition: 'equals',
      value: '',
      action: 'show',
      targetQuestion: ''
    }
    
    setLogicRules(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), newRule]
    }))
  }

  const handleUpdateRule = (questionId, ruleId, updates) => {
    setLogicRules(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ) || []
    }))
  }

  const handleDeleteRule = (questionId, ruleId) => {
    setLogicRules(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.filter(rule => rule.id !== ruleId) || []
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conditional Logic Builder
        </h3>
        <p className="text-gray-600 mb-6">
          Create rules to show or hide questions based on previous answers.
        </p>
      </div>

      {/* Question Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Question to Add Logic
        </label>
        <select
          value={selectedQuestion || ''}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Choose a question...</option>
          {questions.map(question => (
            <option key={question.id} value={question.id}>
              {question.question_text}
            </option>
          ))}
        </select>
      </div>

      {/* Logic Rules */}
      {selectedQuestion && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              Logic Rules for Selected Question
            </h4>
            <button
              onClick={() => handleAddRule(selectedQuestion)}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
            >
              Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {logicRules[selectedQuestion]?.map((rule, index) => (
              <div key={rule.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <select
                    value={rule.condition}
                    onChange={(e) => handleUpdateRule(selectedQuestion, rule.id, { condition: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                  </select>
                  
                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => handleUpdateRule(selectedQuestion, rule.id, { value: e.target.value })}
                    placeholder="Value"
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  
                  <select
                    value={rule.action}
                    onChange={(e) => handleUpdateRule(selectedQuestion, rule.id, { action: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                  </select>
                  
                  <select
                    value={rule.targetQuestion}
                    onChange={(e) => handleUpdateRule(selectedQuestion, rule.id, { targetQuestion: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select target question...</option>
                    {questions
                      .filter(q => q.id !== selectedQuestion)
                      .map(question => (
                        <option key={question.id} value={question.id}>
                          {question.question_text}
                        </option>
                      ))}
                  </select>
                </div>
                
                <button
                  onClick={() => handleDeleteRule(selectedQuestion, rule.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logic Preview */}
      {Object.keys(logicRules).length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Logic Summary</h4>
          <div className="space-y-2">
            {Object.entries(logicRules).map(([questionId, rules]) => {
              const question = questions.find(q => q.id === questionId)
              return (
                <div key={questionId} className="text-sm text-gray-600">
                  <strong>{question?.question_text}:</strong>
                  <ul className="ml-4 mt-1">
                    {rules.map((rule, index) => (
                      <li key={index}>
                        If answer {rule.condition} "{rule.value}" then {rule.action} question
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConditionalLogicBuilder
