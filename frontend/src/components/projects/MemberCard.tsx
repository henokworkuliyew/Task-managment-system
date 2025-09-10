'use client'

import { User } from '@/types'
import { FiMessageCircle, FiMail, FiUser } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface MemberCardProps {
  member: User
  projectId: string
  isOnline?: boolean
}

export default function MemberCard({ member, projectId, isOnline = false }: MemberCardProps) {
  const router = useRouter()

  const handleChatClick = () => {
    router.push(`/chat/${projectId}`)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {member.name?.charAt(0).toUpperCase() || <FiUser className="w-5 h-5" />}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {member.name || 'Unknown User'}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {member.email}
          </p>
          {member.role && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
              {member.role}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleChatClick}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Start chat"
          >
            <FiMessageCircle className="w-4 h-4" />
          </button>
          
          <a
            href={`mailto:${member.email}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Send email"
          >
            <FiMail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
