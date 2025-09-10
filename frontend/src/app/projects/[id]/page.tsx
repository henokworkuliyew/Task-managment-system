'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProjectById, updateProject, deleteProject } from '@/redux/slices/projectSlice';
import { fetchTasksByProject } from '@/redux/slices/taskSlice';
import { useSocket } from '@/hooks/useSocket';
import { Task, Project, User } from '@/types';
import { FiTrash2 } from 'react-icons/fi';
import TaskCard from '@/components/tasks/TaskCard';
import MemberCard from '@/components/projects/MemberCard';
import TaskForm from '@/components/tasks/TaskForm';
import ProjectForm from '@/components/projects/ProjectForm';
import Link from 'next/link';
import { Button, Card, Modal } from '../../../components/common';
import { 
  FiPlus, 
  FiEdit, 
  FiCalendar, 
  FiUsers, 
  FiClock, 
  FiArrowLeft,
  FiBarChart,
  FiTarget,
  FiActivity,
  FiCheckCircle,
  FiStar,
  FiGitBranch,
  FiMessageCircle,
  FiFileText,
  FiTrendingUp,
  FiAlertCircle,
  FiSettings,
  FiShare2,
  FiDownload,
  FiFilter,
  FiSearch,
  FiMoreVertical,
  FiEye,
  FiHeart,
  FiBookmark,
  FiFlag,
  FiPieChart,
  FiGrid,
  FiList,
  FiCalendar as FiCalendarView,
  FiFolder,
  FiUpload,
  FiLink,
  FiMail,
  FiBell,
  FiArchive
} from 'react-icons/fi';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentProject: project, isLoading: projectLoading } = useAppSelector((state) => state.projects);
  const { tasks, isLoading: tasksLoading } = useAppSelector((state) => state.tasks);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  })
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set())

  const { isConnected } = useSocket({
    projectId: id as string,
    onUserJoined: (data) => {
      setOnlineMembers(prev => new Set([...prev, data.userId]))
    },
    onUserLeft: (data) => {
      setOnlineMembers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    },
  })

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id as string));
      dispatch(fetchTasksByProject(id as string));
    }
  }, [dispatch, id]);

  const handleCreateTaskSuccess = () => {
    setIsCreateTaskModalOpen(false);
    setEditingTask(null);
    dispatch(fetchTasksByProject(id as string));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsCreateTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleEditProjectSuccess = () => {
    setIsEditProjectModalOpen(false);
    dispatch(fetchProjectById(id as string));
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <Link href="/projects">
            <Button variant="primary">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((task: Task) => task.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header Background */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/projects">
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm">
                      <FiArrowLeft className="h-5 w-5 text-white" />
                    </button>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl font-bold text-white">{project.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{project.name}</h1>
                      <p className="text-blue-100 text-lg">{project.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-xl transition-all duration-200 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    <FiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-xl transition-all duration-200 ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    <FiBookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
                    >
                      <FiMoreVertical className="h-5 w-5 text-white" />
                    </button>
                    {showMoreActions && (
                      <div className="absolute right-0 top-14 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 min-w-[200px]">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                          <FiShare2 className="w-4 h-4 mr-3" />Share Project
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                          <FiDownload className="w-4 h-4 mr-3" />Export Data
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center">
                          <FiArchive className="w-4 h-4 mr-3" />Archive Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="px-8 py-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status === 'completed' && <FiCheckCircle className="w-4 h-4" />}
                    {project.status === 'in_progress' && <FiActivity className="w-4 h-4" />}
                    {project.status === 'on_hold' && <FiAlertCircle className="w-4 h-4" />}
                    {project.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getPriorityColor(project.priority)} bg-opacity-10`}>
                    <FiFlag className="w-4 h-4" />
                    {project.priority.toUpperCase()} PRIORITY
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiEye className="w-4 h-4" />
                    <span>{Math.floor(Math.random() * 500) + 100} views</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => setIsEditProjectModalOpen(true)}>
                    <FiEdit className="mr-2 h-4 w-4" />Edit
                  </Button>
                  <Button variant="primary" onClick={() => setIsCreateTaskModalOpen(true)}>
                    <FiPlus className="mr-2 h-4 w-4" />Add Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-900">{totalTasks}</p>
                <p className="text-xs text-blue-600 mt-1">+{Math.floor(Math.random() * 5) + 1} this week</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <FiTarget className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completedTasks}</p>
                <p className="text-xs text-green-600 mt-1">{Math.round(progressPercentage)}% done</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <FiCheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">In Progress</p>
                <p className="text-3xl font-bold text-amber-900">
                  {tasks.filter((task: Task) => task.status === 'in_progress').length}
                </p>
                <p className="text-xs text-amber-600 mt-1">Active work</p>
              </div>
              <div className="p-3 bg-amber-500 rounded-xl">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Team Size</p>
                <p className="text-3xl font-bold text-purple-900">{project.members?.length || 0}</p>
                <p className="text-xs text-purple-600 mt-1">Active members</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <FiUsers className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
              <span className="text-sm font-medium text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-gray-900">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-3 h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-gray-900">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FiBarChart className="mr-3 h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Priority</p>
                      <p className={`font-semibold ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="mr-3 h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Team Size</p>
                      <p className="text-gray-900">{project.members?.length || 0} members</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              <div className="space-y-3">
                {project.members && project.members.length > 0 ? (
                  project.members.map((member) => (
                    <MemberCard 
                      key={member.id} 
                      member={member} 
                      projectId={project.id}
                      isOnline={onlineMembers.has(member.id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No team members yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          </div>
          
          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FiTarget className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first task for this project.</p>
              <Button
                variant="primary"
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={handleCloseTaskModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
        size="lg"
      >
        <TaskForm 
          task={editingTask} 
          projectId={id as string}
          onSuccess={handleCreateTaskSuccess} 
          onCancel={handleCloseTaskModal} 
        />
      </Modal>

      {project && (
        <Modal
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
          title="Edit Project"
          size="lg"
        >
          <ProjectForm 
            project={project} 
            onSuccess={handleEditProjectSuccess} 
            onCancel={() => setIsEditProjectModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}