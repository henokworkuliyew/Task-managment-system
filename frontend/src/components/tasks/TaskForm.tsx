'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Task, Priority, TaskStatus } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';

interface TaskFormProps {
  task?: Task | null;
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TaskForm = ({ task, projectId, onSuccess, onCancel }: TaskFormProps) => {
  console.log('TaskForm rendered with props:', { task, projectId, onSuccess, onCancel });
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!task;
  
  const projects = useAppSelector((state) => state.projects.projects);
  const users = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (Array.isArray(projects) && projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [dispatch, projects.length]);

  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo' as TaskStatus,
    priority: task?.priority || 'medium' as Priority,
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    projectId: task?.project?.id || projectId || '',
    assignedToId: task?.assignee?.id || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Task title is required'),
    description: Yup.string(),
    status: Yup.string().oneOf(['todo', 'in_progress', 'review', 'done']),
    priority: Yup.string().oneOf(['low', 'medium', 'high']),
    dueDate: Yup.date().nullable(),
    projectId: Yup.string().required('Project is required'),
    assignedToId: Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const taskData = {
          ...values,
        };

        if (isEditing && task) {
          await dispatch(updateTask({ id: task.id, data: taskData }) as any);
        } else {
          await dispatch(createTask(taskData) as any);
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error submitting task:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...formik.getFieldProps('title')}
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...formik.getFieldProps('description')}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
            Project *
          </label>
          <select
            id="projectId"
            name="projectId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('projectId')}
            disabled={!!projectId}
          >
            <option value="">Select a project</option>
            {Array.isArray(projects) ? projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            )) : null}
          </select>
          {formik.touched.projectId && formik.errors.projectId && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.projectId}</div>
          )}
        </div>

        <div>
          <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700">
            Assigned To
          </label>
          <select
            id="assignedToId"
            name="assignedToId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('assignedToId')}
          >
            <option value="">Unassigned</option>
            {Array.isArray(users) ? users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            )) : null}
          </select>
          {formik.touched.assignedToId && formik.errors.assignedToId && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.assignedToId}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('status')}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {formik.touched.priority && formik.errors.priority && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.priority}</div>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('dueDate')}
          />
          {formik.touched.dueDate && formik.errors.dueDate && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.dueDate}</div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiX className="mr-2 -ml-1 h-5 w-5" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiSave className="mr-2 -ml-1 h-5 w-5" />
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;