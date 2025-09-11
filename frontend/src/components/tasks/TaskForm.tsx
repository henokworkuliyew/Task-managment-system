'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Task, Priority, Project, User, TaskStatus } from '../../types';
import { CreateTaskData, UpdateTaskData } from '../../redux/slices/taskSlice';
import { FiSave, FiX } from 'react-icons/fi';

interface TaskFormProps {
  task?: Task | null;
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
  projects?: Project[];
  onSubmit?: (data: Partial<Task>) => void;
  submitButtonText?: React.ReactNode;
  isSubmitting?: boolean;
}

const TaskForm = ({ 
  task, 
  projectId, 
  onSuccess, 
  onCancel, 
  initialData, 
  projects: propProjects, 
  onSubmit: propOnSubmit, 
  submitButtonText, 
  isSubmitting: propIsSubmitting 
}: TaskFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!task;
  
  const storeProjects = useAppSelector((state) => state.projects.projects);
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const projects = propProjects || storeProjects;
  
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialData?.projectId || task?.project?.id || projectId || ''
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [dispatch, projects]);

  const initialValues = {
    title: initialData?.title || task?.title || '',
    description: initialData?.description || task?.description || '',
    status: initialData?.status || task?.status || 'todo' as TaskStatus,
    priority: initialData?.priority || task?.priority || 'medium' as Priority,
    deadline: initialData?.deadline || (task?.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''),
    projectId: initialData?.projectId || task?.project?.id || projectId || '',
    assigneeId: initialData?.assigneeId || task?.assignee?.id || '',
    estimatedHours: initialData?.estimatedHours || task?.estimatedHours || 0,
    progress: initialData?.progress || task?.progress || 0,
    tags: initialData?.tags || [],
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Task title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be less than 100 characters'),
    description: Yup.string()
      .max(500, 'Description must be less than 500 characters'),
    status: Yup.string()
      .oneOf(['todo', 'in_progress', 'review', 'done'], 'Invalid status'),
    priority: Yup.string()
      .oneOf(['low', 'medium', 'high'], 'Invalid priority'),
    deadline: Yup.date()
      .nullable()
      .min(new Date(), 'Due date cannot be in the past'),
    projectId: Yup.string().required('Project is required'),
    assigneeId: Yup.string(),
  });

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (selectedProjectId) {
        setLoadingMembers(true);
        try {
          // Always fetch fresh project members from the API instead of using cached project data
          const token = localStorage.getItem('accessToken');
          if (!token || token === 'undefined' || token === 'null') {
            console.error('No valid access token found');
            return;
          }
          
          // Use the dedicated endpoint to get all project members
          const response = await fetch(`/api/v1/users/project/${selectedProjectId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const members = await response.json();
            console.log('Fetched project members:', members);
            setProjectMembers(Array.isArray(members) ? members : []);
            
            // Also get project details for owner info
            const projectResponse = await fetch(`/api/v1/projects/${selectedProjectId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              setSelectedProject(projectData);
            }
          } else {
            console.error('Failed to fetch project members:', response.status, response.statusText);
            setProjectMembers([]);
          }
        } catch (error) {
          console.error('Failed to fetch project members:', error);
          setProjectMembers([]);
          setSelectedProject(null);
        } finally {
          setLoadingMembers(false);
        }
      } else {
        setProjectMembers([]);
        setSelectedProject(null);
      }
    };

    fetchProjectMembers();
  }, [selectedProjectId, projects]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        if (propOnSubmit) {
          await propOnSubmit(values);
          return;
        }
        
        if (isEditing && task) {
          const updateData: UpdateTaskData = {
            title: values.title,
            description: values.description || undefined,
            status: values.status,
            priority: values.priority,
            projectId: values.projectId,
          };

          if (values.deadline) {
            updateData.deadline = values.deadline;
          }

          if (values.assigneeId && values.assigneeId.trim() !== '') {
            updateData.assigneeId = values.assigneeId;
          }

          const result = await dispatch(updateTask({ id: task.id, data: updateData }));
          if (updateTask.fulfilled.match(result)) {
            toast.success('Task updated successfully!');
            if (onSuccess) {
              onSuccess();
            }
          } else {
            throw new Error('Failed to update task');
          }
        } else {
          const createData: CreateTaskData = {
            title: values.title,
            description: values.description || '',
            status: values.status,
            priority: values.priority,
            projectId: values.projectId,
            deadline: values.deadline || '',
          };

          if (values.assigneeId && values.assigneeId.trim() !== '') {
            createData.assigneeId = values.assigneeId;
          }

          const result = await dispatch(createTask(createData));
          if (createTask.fulfilled.match(result)) {
            toast.success('Task created successfully!');
            if (onSuccess) {
              onSuccess();
            }
          } else {
            throw new Error('Failed to create task');
          }
        }
      } catch (error) {
        console.error('Error submitting task:', error);
        toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-gray-600">Fill in the details below to {isEditing ? 'update' : 'create'} your task.</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Basic Information
          </h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a descriptive task title..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.title)}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Provide a detailed description of the task..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 resize-vertical"
                {...formik.getFieldProps('description')}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.description)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment & Project */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Assignment & Project
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                id="projectId"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('projectId')}
                disabled={!!projectId}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedProjectId(e.target.value);
                }}
              >
                <option value="">Select a project</option>
                {Array.isArray(projects) ? projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                )) : null}
              </select>
              {formik.touched.projectId && formik.errors.projectId && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.projectId)}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
                {selectedProject && currentUser && selectedProject.owner.id !== currentUser.id && (
                  <span className="text-xs text-amber-600 ml-2">
                    (Only project owner can assign tasks to others)
                  </span>
                )}
              </label>
              <select
                id="assigneeId"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('assigneeId')}
                disabled={!!(selectedProject && currentUser && selectedProject.owner.id !== currentUser.id && formik.values.assigneeId !== currentUser.id)}
              >
                <option value="">Unassigned</option>
                {loadingMembers ? (
                  <option disabled>Loading members...</option>
                ) : (
                  projectMembers.map((user: User) => {
                    // If current user is not project owner, they can only assign to themselves
                    if (selectedProject && currentUser && selectedProject.owner.id !== currentUser.id && user.id !== currentUser.id) {
                      return null;
                    }
                    return (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.id === selectedProject?.owner.id ? '(Owner)' : ''}
                      </option>
                    );
                  })
                )}
              </select>
              {formik.touched.assigneeId && formik.errors.assigneeId && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.assigneeId)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            Task Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('status')}
              >
                <option value="todo">📋 To Do</option>
                <option value="in_progress">⚡ In Progress</option>
                <option value="review">👀 Review</option>
                <option value="done">✅ Done</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.status)}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('priority')}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              {formik.touched.priority && formik.errors.priority && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.priority)}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                id="deadline"
                type="date"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                {...formik.getFieldProps('deadline')}
              />
              {formik.touched.deadline && formik.errors.deadline && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {String(formik.errors.deadline)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={propIsSubmitting || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
            >
              {(propIsSubmitting || isSubmitting) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                submitButtonText || (
                  <>
                    <FiSave className="mr-2" />
                    {isEditing ? 'Update Task' : 'Create Task'}
                  </>
                )
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;