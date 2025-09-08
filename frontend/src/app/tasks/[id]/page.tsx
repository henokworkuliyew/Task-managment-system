'use client';

import { useEffect } from 'react';
import { RootState } from '../../../types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchTaskById } from '../../../redux/slices/taskSlice';
import { fetchProjects } from '../../../redux/slices/projectSlice';
import { Button } from '../../../components/common';
import { 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiFlag, 
  FiEdit, 
  FiArrowLeft,
  FiAlertCircle,
  FiFolder,
  FiTarget,
  FiBarChart,
  FiPaperclip,
  FiActivity,
  FiTrendingUp,
  FiTag,
  FiCheckCircle
} from 'react-icons/fi';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentTask: task, isLoading: taskLoading } = useAppSelector((state: RootState) => state.tasks);
  const { projects } = useAppSelector((state: RootState) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id as string));
      if (!Array.isArray(projects) || projects.length === 0) {
        dispatch(fetchProjects({}));
      }
    }
  }, [dispatch, id, projects]);

  // const handleEditSuccess = () => {
  //   setIsEditModalOpen(false);
  //   dispatch(fetchTaskById(id as string));
  // };

  if (taskLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h3>
            <p className="text-gray-600 mb-6">
              The task you are looking for does not exist or has been deleted.
            </p>
            <Button
              variant="primary"
              icon={FiArrowLeft}
              onClick={() => router.push('/tasks')}
            >
              Back to Tasks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const project = Array.isArray(projects) ? projects.find((p) => p.id === task.project?.id) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon={FiArrowLeft}
                onClick={() => router.push('/tasks')}
                className="hover:bg-slate-100"
              >
                Back
              </Button>
              <div className="h-8 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <p className="text-sm text-gray-600">Task Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-green-500">
              <Link href={`/tasks/${id}/edit`}>
                <Button
                  variant="outline"
                  className="flex items-center"
                >
                  <FiEdit className="mr-2 h-4 w-4" />
                  Edit Task
                </Button>
              </Link>
              {project && (
                <Link href={`/projects/${project.id}`}>
                  <Button
                    variant="outline"
                    icon={FiFolder}
                    className="hover:bg-slate-100"
                  >
                    View Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Task Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Task Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{task.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{task.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-3 ml-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getPriorityColor(task.priority)}`}>
                    <FiFlag className="mr-2 h-4 w-4" />
                    {task.priority} Priority
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                    <FiActivity className="mr-2 h-4 w-4" />
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-4 h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-4 h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assigned To</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {task.assignee?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-4 h-6 w-6 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {project && (
                    <div className="flex items-center text-gray-600">
                      <FiFolder className="mr-4 h-6 w-6 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project</p>
                        <Link href={`/projects/${project.id}`}>
                          <p className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            {project.name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FiTrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                    Task Progress
                  </h3>
                  <span className="text-sm font-medium text-blue-600">{task.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {task.status === 'done' ? 'Task completed successfully!' : 
                   task.status === 'in_progress' ? 'Task is currently being worked on' :
                   task.status === 'review' ? 'Task is under review' :
                   task.status === 'blocked' ? 'Task is currently blocked' :
                   'Task is ready to start'}
                </p>
              </div>

              {/* Time Tracking Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <FiClock className="mr-2 h-5 w-5 text-orange-500" />
                  Time Tracking
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{task.estimatedHours || 0}h</p>
                    <p className="text-sm text-gray-600">Estimated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">0h</p>
                    <p className="text-sm text-gray-600">Logged</p>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {task.tags && task.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FiTag className="mr-2 h-5 w-5 text-blue-600" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.status === 'done' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-center text-green-600">
                    <FiCheckCircle className="mr-3 h-8 w-8" />
                    <div>
                      <h3 className="text-lg font-semibold">Task Completed!</h3>
                      <p className="text-sm text-green-700">This task has been successfully completed</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTarget className="mr-2 h-5 w-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon={FiEdit}
                  onClick={() => router.push(`/tasks/${id}/edit`)}
                  className="w-full justify-start border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  Edit Task
                </Button>
                {project && (
                  <Link href={`/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      icon={FiFolder}
                      className="w-full justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    >
                      View Project
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  icon={FiBarChart}
                  onClick={() => {/* Add analytics view */}}
                  className="w-full justify-start border-green-200 hover:border-green-300 hover:bg-green-50"
                >
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Task Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2 h-5 w-5 text-green-500" />
                Task Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {task.deadline && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Due Date</span>
                    <span className="text-sm text-gray-900">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2 h-5 w-5 text-purple-500" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Task created</p>
                    <p className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {task.assignee && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Assigned to {task.assignee.name}</p>
                      <p className="text-xs text-gray-500">{new Date(task.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {task.status === 'done' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Task completed</p>
                      <p className="text-xs text-gray-500">{new Date(task.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiPaperclip className="mr-2 h-5 w-5 text-orange-500" />
                Attachments
              </h3>
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((attachment: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FiPaperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FiPaperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No attachments</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
