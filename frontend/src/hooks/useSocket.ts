import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface Message {
  id: string
  content: string
  senderId: string
  projectId: string
  createdAt: string
  type: string
}

interface UseSocketOptions {
  projectId: string
  onNewMessage?: (message: Message) => void
  onUserJoined?: (data: { userId: string; username: string }) => void
  onUserLeft?: (data: { userId: string; username: string }) => void
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void
}

export const useSocket = (options: UseSocketOptions) => {
  const { projectId, onNewMessage, onUserJoined, onUserLeft, onUserTyping } =
    options
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  const { accessToken, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!accessToken || !user) return

    if (socketRef.current) {
      socketRef.current.removeAllListeners()
      socketRef.current.disconnect()
      socketRef.current = null
    }

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL ||
      'https://task-managment-system-7jbd.onrender.com'
    ).replace('/api/v1', '')

    const socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to chat server')
    })

    socket.on('connected', (data) => {
      console.log('Socket authenticated:', data)
      if (projectId) socket.emit('join-project', { projectId })
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

    socket.on('new-message', (message) => onNewMessage?.(message))
    socket.on('user-joined', (data) => onUserJoined?.(data))
    socket.on('user-left', (data) => onUserLeft?.(data))

    socket.on('user-typing', (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev)
        data.isTyping ? newSet.add(data.userId) : newSet.delete(data.userId)
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
    socketRef.current?.emit('send-message', { projectId, content, type })
  }

  const startTyping = () =>
    socketRef.current?.emit('typing-start', { projectId })
  const stopTyping = () => socketRef.current?.emit('typing-stop', { projectId })

  const joinProject = (newProjectId: string) =>
    socketRef.current?.emit('join-project', { projectId: newProjectId })
  const leaveProject = (oldProjectId: string) =>
    socketRef.current?.emit('leave-project', { projectId: oldProjectId })

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
