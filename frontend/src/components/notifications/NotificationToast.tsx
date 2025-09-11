'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { io, Socket } from 'socket.io-client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

export const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const { accessToken, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!accessToken || !user) return

    const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/chat`, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    socketConnection.on('new-message', (message: { id: string; content: string; senderId: string; sender?: { name: string } }) => {
      if (message.senderId !== user.id) {
        const notification: Notification = {
          id: `msg-${message.id}`,
          title: 'New Message',
          message: `${message.sender?.name || 'Someone'}: ${message.content}`,
          type: 'info',
          timestamp: new Date()
        }
        
        setNotifications(prev => [...prev, notification])
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          })
        }
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id))
        }, 5000)
      }
    })

    socketConnection.on('notification', (notification: { title?: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => {
      const toast: Notification = {
        id: `notif-${Date.now()}`,
        title: notification.title || 'Notification',
        message: notification.message,
        type: notification.type || 'info',
        timestamp: new Date()
      }
      
      setNotifications(prev => [...prev, toast])
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== toast.id))
      }, 5000)
    })

    setSocket(socketConnection)

    return () => {
      socketConnection.disconnect()
    }
  }, [accessToken, user])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg border-l-4 bg-white
            ${notification.type === 'success' ? 'border-green-500' : ''}
            ${notification.type === 'error' ? 'border-red-500' : ''}
            ${notification.type === 'warning' ? 'border-yellow-500' : ''}
            ${notification.type === 'info' ? 'border-blue-500' : ''}
            animate-slide-in-right
          `}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
