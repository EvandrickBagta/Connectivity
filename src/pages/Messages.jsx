import React, { useState } from 'react'

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      user: {
        id: 'user-1',
        name: 'Alice Johnson',
        avatar: null, // Will use generic icon
        status: 'online'
      },
      lastMessage: 'Hey! Are you still interested in joining our AI research project?',
      timestamp: '2 min ago',
      unread: 2
    },
    {
      id: 2,
      user: {
        id: 'user-2',
        name: 'Bob Smith',
        avatar: null, // Will use generic icon
        status: 'offline'
      },
      lastMessage: 'Thanks for the invite! I\'d love to contribute to the sustainability project.',
      timestamp: '1 hour ago',
      unread: 0
    },
    {
      id: 3,
      user: {
        id: 'user-3',
        name: 'Carol Davis',
        avatar: null, // Will use generic icon
        status: 'online'
      },
      lastMessage: 'The team meeting is scheduled for tomorrow at 3 PM.',
      timestamp: '3 hours ago',
      unread: 1
    }
  ]

  // Mock messages for active conversation
  const messages = activeConversation ? [
    {
      id: 1,
      sender: 'other',
      content: 'Hey! Are you still interested in joining our AI research project?',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      sender: 'me',
      content: 'Yes, absolutely! I\'d love to contribute to the machine learning aspects.',
      timestamp: '1 min ago'
    },
    {
      id: 3,
      sender: 'other',
      content: 'Perfect! We\'re focusing on natural language processing. What\'s your experience with NLP?',
      timestamp: 'Just now'
    }
  ] : []

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    // TODO: Implement actual message sending
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  // Generic avatar component
  const GenericAvatar = ({ name, size = 'w-12 h-12' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
    return (
      <div className={`${size} rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold`}>
        {initials}
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Connect with your team members</p>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeConversation?.id === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {conversation.user.avatar ? (
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <GenericAvatar name={conversation.user.name} size="w-12 h-12" />
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        conversation.user.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.user.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {activeConversation.user.avatar ? (
                        <img
                          src={activeConversation.user.avatar}
                          alt={activeConversation.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <GenericAvatar name={activeConversation.user.name} size="w-10 h-10" />
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        activeConversation.user.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{activeConversation.user.name}</h2>
                      <p className="text-sm text-gray-600">
                        {activeConversation.user.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'me'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-indigo-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
