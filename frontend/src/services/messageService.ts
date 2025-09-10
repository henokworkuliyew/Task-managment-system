import api from './api'
import { Message, CreateMessageData, UpdateMessageData } from '@/types'

const messageService = {
  sendMessage: async (messageData: { projectId: string; messageData: { content: string; type: string } }): Promise<Message> => {
    const response = await api.post<{success: boolean, data: Message, timestamp: string}>('/messages', messageData)
    return response.data.data
  },

  getProjectMessages: async (projectId: string, params: Record<string, string | number> = {}): Promise<{
    data: Message[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    const response = await api.get<{success: boolean, data: {
      data: Message[]
      total: number
      page: number
      limit: number
      totalPages: number
    }, timestamp: string}>(`/messages/project/${projectId}${queryString ? `?${queryString}` : ''}`)
    return response.data.data
  },

  updateMessage: async (id: string, messageData: UpdateMessageData): Promise<Message> => {
    const response = await api.put<{success: boolean, data: Message, timestamp: string}>(`/messages/${id}`, messageData)
    return response.data.data
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/messages/${id}`)
  },
}

export const { sendMessage, getProjectMessages, updateMessage, deleteMessage } = messageService
export default messageService
