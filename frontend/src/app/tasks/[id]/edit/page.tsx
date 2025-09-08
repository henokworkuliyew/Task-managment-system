'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState, Task } from '../../../../types'
import { fetchTaskById, updateTask } from '../../../../redux/slices/taskSlice'
import { fetchProjects } from '../../../../redux/slices/projectSlice'
import { Button, Card } from '../../../../components/common'
import { TaskForm } from '../../../../components/tasks'
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi'
import Link from 'next/link'

export default function EditTaskPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentTask: task, isLoading: taskLoading } = useAppSelector((state: RootState) => state.tasks)
  const { projects } = useAppSelector((state: RootState) => state.projects)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id as string))
      dispatch(fetchProjects({ page: 1, limit: 100 }))
    }
  }, [dispatch, id])

  const handleSubmit = async (taskData: Partial<Task>) => {
    if (!task?.id) return

    setIsSubmitting(true)
    try {
      await dispatch(updateTask({ 
        id: task.id, 
        data: {
          title: taskData.title || '',
          description: taskData.description || '',
          status: (taskData.status as 'todo' | 'in_progress' | 'review' | 'done') || 'todo',
          priority: (taskData.priority as 'low' | 'medium' | 'high') || 'medium',
          deadline: taskData.deadline || '',
          projectId: task.project?.id || taskData.projectId || '',
          assignedTo: taskData.assigneeId || undefined
        }
      })).unwrap()
      
      // Navigate back to task detail page
      router.push(`/tasks/${task.id}`)
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/tasks/${id}`)
  }

  if (taskLoading || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/tasks/${id}`}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Task
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Task
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Update task details and settings
          </p>
        </div>

        {/* Edit Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Task Information
              </h2>
              <p className="text-gray-600">
                Modify the task details below. All changes will be saved when you submit.
              </p>
            </div>

            <TaskForm
              initialData={{
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                assigneeId: task.assignee?.id || '',
                projectId: task.project?.id || '',
                estimatedHours: task.estimatedHours || 0,
                progress: task.progress || 0,
                tags: task.tags || []
              }}
              projects={Array.isArray(projects) ? projects : []}
              onSubmit={handleSubmit}
              submitButtonText={
                <div className="flex items-center">
                  <FiSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Updating...' : 'Update Task'}
                </div>
              }
              isSubmitting={isSubmitting}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
