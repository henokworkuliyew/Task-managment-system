export interface Message {
  id: string
  content: string
  type: 'text' | 'file' | 'image'
  attachments: string[]
  isEdited: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    name: string
    email: string
    profilePicture?: string
  }
  senderId: string
  projectId: string
}

export interface CreateMessageData {
  content: string
  type?: 'text' | 'file' | 'image'
  attachments?: string[]
  projectId: string
}

export interface UpdateMessageData {
  content?: string
  attachments?: string[]
}

export interface MessageState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  totalCount: number
}
