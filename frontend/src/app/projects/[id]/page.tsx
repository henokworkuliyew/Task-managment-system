'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchProjectById } from '../../../redux/slices/projectSlice';
import { fetchTasksByProject } from '../../../redux/slices/taskSlice';
import { DashboardLayout } from '../../../components/layout';
import { TaskCard, TaskForm } from '../../../components/tasks';
import { Button, Card, Modal } from '../../../components/common';
import { FiPlus, FiEdit, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import { Task } from '@/types';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { project, loading: projectLoading } = useAppSelector((state) => state.projects);
  const { tasks, loading: tasksLoading } = useAppSelector((state) => state.tasks);
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
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The project you are looking for does not exist or has been deleted.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <Button
              variant="outline"
              icon={FiEdit}
              onClick={() => setIsEditProjectModalOpen(true)}
            >
              Edit Project
            </Button>
          </div>
          <div className="px-6 py-5">
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority} Priority
                </span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Start: {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Due: {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Team: {project.team?.length || 0} members
                </span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-700">{project.description}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Project Tasks</h2>
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => setIsCreateTaskModalOpen(true)}
            >
              Add Task
            </Button>
          </div>

          {tasksLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : tasks.length === 0 ? (
            <Card className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by creating a new task for this project.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  icon={FiPlus}
                  onClick={() => setIsCreateTaskModalOpen(true)}
                >
                  Create Task
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={handleCloseTaskModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
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
          <div className="p-4">
            <p>Project edit form would go here.</p>
            {/* ProjectForm component would be imported and used here */}
            {/* <ProjectForm 
              project={project} 
              onSuccess={handleEditProjectSuccess} 
              onCancel={() => setIsEditProjectModalOpen(false)} 
            /> */}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}