'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchProjectById } from '../../../redux/slices/projectSlice';
import { fetchTasksByProject } from '../../../redux/slices/taskSlice';
import { TaskCard, TaskForm } from '../../../components/tasks';
import { ProjectForm } from '../../../components/projects';
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
} from 'react-icons/fi';
import { Task } from '@/types';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentProject: project, isLoading: projectLoading } = useAppSelector((state) => state.projects);
  const { tasks, isLoading: tasksLoading } = useAppSelector((state) => state.tasks);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="outline" size="sm">
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <p className="mt-2 text-gray-600">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <Button
                variant="outline"
                onClick={() => setIsEditProjectModalOpen(true)}
              >
                <FiEdit className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsCreateTaskModalOpen(true)}
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <FiTarget className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter((task: Task) => task.status === 'in_progress').length}
                </p>
              </div>
              <FiActivity className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-purple-600">{project.members?.length || 0}</p>
              </div>
              <FiUsers className="h-8 w-8 text-purple-500" />
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
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name || member.email}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
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