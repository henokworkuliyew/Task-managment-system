import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface Message {
  id: string;
  content: string;
  senderId: string;
  projectId: string;
  createdAt: string;
  type: string;
}

interface UseSocketOptions {
  projectId: string
  onNewMessage?: (message: Message) => void
  onUserJoined?: (data: { userId: string; username: string }) => void
  onUserLeft?: (data: { userId: string; username: string }) => void
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void
}


export const useSocket = (options: UseSocketOptions) => {
  const { projectId, onNewMessage, onUserJoined, onUserLeft, onUserTyping } = options
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  
  const { accessToken, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!accessToken || !user) {
      return
    }

    // Cleanup existing socket before creating new one
    if (socketRef.current) {
      socketRef.current.removeAllListeners()
      socketRef.current.disconnect()
      socketRef.current = null
    }

    // Extract base URL for Socket.IO connection (remove /api/v1 if present)
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002').replace('/api/v1', '')
    // Initialize socket connection
    const socket = io(baseUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['polling', 'websocket'],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: false,
    })

    socketRef.current = socket

    // Connection handlers
    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat server')
    })

    socket.on('connected', (data) => {
      console.log('Socket authenticated:', data)
      // Join project room after authentication
      if (projectId) {
        socket.emit('join-project', { projectId })
      }
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from chat server')
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
      setIsConnected(false)
    })

    socket.on('reconnect', () => {
      console.log('Socket reconnected')
      setIsConnected(true)
    })

    // Message handlers
    socket.on('new-message', (message) => {
      onNewMessage?.(message)
    })

    socket.on('user-joined', (data) => {
      onUserJoined?.(data)
    })

    socket.on('user-left', (data) => {
      onUserLeft?.(data)
    })

    socket.on('user-typing', (data) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        if (data.isTyping) {
          newSet.add(data.userId)
        } else {
          newSet.delete(data.userId)
        }
        return newSet
      })
      onUserTyping?.(data)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [accessToken, user, projectId])

  const sendMessage = (content: string, type: string = 'text') => {
    if (socketRef.current && projectId) {
      socketRef.current.emit('send-message', {
        projectId,
        content,
        type,
      })
    }
  }

  const startTyping = () => {
    if (socketRef.current && projectId) {
      socketRef.current.emit('typing-start', { projectId })
    }
  }

  const stopTyping = () => {
    if (socketRef.current && projectId) {
      socketRef.current.emit('typing-stop', { projectId })
    }
  }

  const joinProject = (newProjectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-project', { projectId: newProjectId })
    }
  }

  const leaveProject = (oldProjectId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-project', { projectId: oldProjectId })
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    joinProject,
    leaveProject,
  }
}
