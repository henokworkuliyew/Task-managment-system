'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useAppDispatch } from '@/redux/hooks'
import { fetchProjectById } from '@/redux/slices/projectSlice'
import { sendMessage, fetchProjectMessages, addMessage } from '@/redux/slices/messageSlice'
import { useSocket } from '@/hooks/useSocket'
import { Message } from '@/types/message'
import { FiSend, FiArrowLeft, FiUsers } from 'react-icons/fi'
import Link from 'next/link'

export default function ChatPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const dispatch = useAppDispatch()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, isLoading, error } = useSelector((state: RootState) => state.messages)
  const { currentProject } = useSelector((state: RootState) => state.projects)
  const { user } = useSelector((state: RootState) => state.auth)
  
  const [messageText, setMessageText] = useState('')
  const [page, setPage] = useState(1)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  // Socket.IO integration
  const { socket, isConnected, typingUsers, sendMessage: sendSocketMessage, startTyping, stopTyping } = useSocket({
    projectId,
    onNewMessage: (message) => {
      // Add new message to Redux state
      dispatch(addMessage(message))
    },
    onUserJoined: (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]))
    },
    onUserLeft: (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    },
  })

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId))
      // Fetch existing messages
      dispatch(fetchProjectMessages({ projectId, params: { page: 1, limit: 50 } }))
    }

    return () => {
      // cleanup if needed
    }
  }, [dispatch, projectId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    const content = messageText.trim();
    if (!content || !projectId) return

    // Clear the input immediately for better UX
    setMessageText('')

    const messageData = {
      content,
      projectId,
      type: 'text'
    }

    if (isConnected && socket) {
      // Send via Socket.IO
      socket.emit('send-message', messageData)
    } else {
      // Fallback to REST API
      try {
        await dispatch(sendMessage({ projectId, content, type: 'text' })).unwrap()
      } catch (error) {
        console.error('Failed to send message:', error)
        // Restore message text on error
        setMessageText(content)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value)
    
    // Handle typing indicators
    if (isConnected && startTyping) {
      startTyping()
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
      
      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        stopTyping()
      }, 1000)
      
      setTypingTimeout(timeout)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Chat</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/projects" className="text-blue-600 hover:text-blue-800">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/projects/${projectId}`}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentProject?.name || 'Project Chat'}
              </h1>
              <p className="text-sm text-gray-500">
                {currentProject?.members?.length || 0} members
              </p>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-140px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(date)}
                    </span>
                  </div>
                  
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.senderId !== user?.id && (
                          <div className="text-xs font-medium mb-1 opacity-75">
                            {message.sender?.name || 'Unknown User'}
                          </div>
                        )}
                        <div className="text-sm">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.senderId === user?.id
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.createdAt)}
                          {message.isEdited && (
                            <span className="ml-1">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4">
            {typingUsers.size > 0 && (
              <div className="text-sm text-gray-500 mb-2 px-2">
                {Array.from(typingUsers).length === 1 
                  ? 'Someone is typing...' 
                  : `${Array.from(typingUsers).length} people are typing...`}
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {onlineUsers.size > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <FiUsers className="h-3 w-3" />
                  <span>{onlineUsers.size} online</span>
                </div>
              )}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!messageText.trim() || isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
