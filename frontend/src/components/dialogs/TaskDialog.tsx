'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Task, Priority, User, TaskStatus } from '../../types';
import { FiSave, FiX, FiCheckSquare, FiFlag, FiUser, FiFolder } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { userService } from '../../services';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  projectId?: string;
  onSuccess?: () => void;
}

const TaskDialog = ({ isOpen, onClose, task, projectId, onSuccess }: TaskDialogProps) => {
  const dispatch = useAppDispatch();
  const { projects = [] } = useAppSelector((state) => state.projects || {});
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(task?.project?.id || projectId || '');
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const isEditing = !!task;

  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.project?.id || projectId || '',
    assigneeId: task?.assignee?.id || '',
    priority: task?.priority || 'medium' as Priority,
    status: task?.status || 'todo' as TaskStatus,
    dueDate: task?.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Task title is required')
      .min(3, 'Task title must be at least 3 characters')
      .max(200, 'Task title must be less than 200 characters'),
    description: Yup.string()
      .max(1000, 'Description must be less than 1000 characters'),
    projectId: Yup.string().required('Project is required'),
    assigneeId: Yup.string(),
    priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority'),
    status: Yup.string().oneOf(['todo', 'in_progress', 'completed'], 'Invalid status'),
    dueDate: Yup.date().nullable(),
  });

  useEffect(() => {
    if (isOpen && projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [isOpen, projects.length, dispatch]);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (selectedProjectId && selectedProjectId !== '') {
        setLoadingMembers(true);
        try {
          const members = await userService.getProjectMembers(selectedProjectId);
          setProjectMembers(members);
        } catch (error) {
          setProjectMembers([]);
        } finally {
          setLoadingMembers(false);
        }

      } else {
        setProjectMembers([]);
      }
    };

    fetchProjectMembers();
  }, [selectedProjectId]);

  const canAssignToOthers = () => {
    if (!user || !selectedProjectId) return false;
    const project = projects.find(p => p.id === selectedProjectId);
    return project?.owner?.id === user.id;
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const taskData = {
          title: values.title,
          description: values.description,
          projectId: values.projectId,
          priority: values.priority as Priority,
          status: values.status as TaskStatus,
          deadline: values.dueDate || '',
          assigneeId: values.assigneeId || undefined,
        };

        if (isEditing && task) {
          const result = await dispatch(updateTask({ id: task.id, data: taskData }));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Task updated successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Update failed');
          }
        } else {
          const result = await dispatch(createTask(taskData));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Task created successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Creation failed');
          }
        }
      } catch {
        toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    formik.setFieldValue('projectId', projectId);
    formik.setFieldValue('assigneeId', '');
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedProjectId(task?.project?.id || projectId || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <FiCheckSquare className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-medium text-gray-800">Task Details</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter a clear task title..."
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.title}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Provide detailed task description..."
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500 rounded-lg mr-3">
                  <FiFolder className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Project & Assignment</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <select
                    id="projectId"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    value={formik.values.projectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.projectId && formik.errors.projectId && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.projectId}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    id="assigneeId"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    {...formik.getFieldProps('assigneeId')}
                    disabled={loadingMembers || !selectedProjectId}
                  >
                    <option value="">Unassigned</option>
                    {user && (
                      <option value={user.id}>👤 {user.name} (You)</option>
                    )}
                    {canAssignToOthers() && Array.isArray(projectMembers) && projectMembers
                      .filter(member => member.id !== user?.id)
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          👥 {member.name}
                        </option>
                      ))}
                  </select>
                  {!canAssignToOthers() && selectedProjectId && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center">
                      <FiUser className="w-3 h-3 mr-1" />
                      Only project owners can assign tasks to others
                    </p>
                  )}
                  {formik.touched.assigneeId && formik.errors.assigneeId && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.assigneeId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-500 rounded-lg mr-3">
                  <FiFlag className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Status & Priority</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    {...formik.getFieldProps('status')}
                  >
                    <option value="todo">📋 To Do</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.status}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    {...formik.getFieldProps('priority')}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                  {formik.touched.priority && formik.errors.priority && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.priority}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    {...formik.getFieldProps('dueDate')}
                  />
                  {formik.touched.dueDate && formik.errors.dueDate && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.dueDate}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 flex items-center"
            >
              <FiX className="mr-2 w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave className="mr-2 w-4 h-4" />
                  {isEditing ? 'Update Task' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
