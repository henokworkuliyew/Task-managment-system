import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import messageService from '../../services/messageService'
import { MessageState, Message, CreateMessageData, UpdateMessageData } from '../../types'

interface PaginationParams {
  page?: number
  limit?: number
  [key: string]: string | number | undefined
}

interface ServiceParams {
  [key: string]: string | number
}

interface ApiResponse {
  data: Message[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const initialState: MessageState = {
  messages: [],
  isLoading: false,
  error: null,
  totalCount: 0,
}

export const fetchProjectMessages = createAsyncThunk<{ data: Message[]; totalCount: number }, { projectId: string; params?: PaginationParams }>(
  'messages/fetchProjectMessages',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const serviceParams: ServiceParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as ServiceParams
      const response = await messageService.getProjectMessages(projectId, serviceParams) as ApiResponse
      
      if (response && typeof response === 'object' && 'data' in response && 'total' in response) {
        return {
          data: Array.isArray(response.data) ? response.data : [],
          totalCount: response.total || 0
        }
      }
      
      return {
        data: [],
        totalCount: 0
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages'
      return rejectWithValue(errorMessage)
    }
  }
)

export const sendMessage = createAsyncThunk<Message, { projectId: string; content: string; type: string }>(
  'messages/sendMessage',
  async ({ projectId, content, type }, { rejectWithValue }) => {
    try {
      const messageData = {
        projectId,
        messageData: { content, type }
      }
      const message = await messageService.sendMessage(messageData)
      return message
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateMessage = createAsyncThunk<Message, { id: string; data: UpdateMessageData }>(
  'messages/updateMessage',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const message = await messageService.updateMessage(id, data)
      return message
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update message'
      return rejectWithValue(errorMessage)
    }
  }
)

export const deleteMessage = createAsyncThunk<string, string>(
  'messages/deleteMessage',
  async (id: string, { rejectWithValue }) => {
    try {
      await messageService.deleteMessage(id)
      return id
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message'
      return rejectWithValue(errorMessage)
    }
  }
)

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = []
      state.totalCount = 0
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Add new message to the end of the array (most recent)
      state.messages.push(action.payload)
      state.totalCount += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMessages.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjectMessages.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages = action.payload.data
        state.totalCount = action.payload.totalCount
        state.error = null
      })
      .addCase(fetchProjectMessages.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.unshift(action.payload)
        state.totalCount += 1
        state.error = null
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(msg => msg.id === action.payload.id)
        if (index !== -1) {
          state.messages[index] = action.payload
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg.id !== action.payload)
        state.totalCount -= 1
      })
  },
})

export const { clearMessages, clearError, addMessage } = messageSlice.actions
export default messageSlice.reducer
