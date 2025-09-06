'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createIssue, updateIssue } from '../../redux/slices/issueSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Issue, Priority, Project, User } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';
import { RootState } from '../../redux/store';

interface IssueFormProps {
  issue?: Issue | null;
  projectId?: string;
  taskId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const IssueForm = ({ issue, projectId, taskId, onSuccess, onCancel }: IssueFormProps) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!issue;
  
  const projects = useSelector((state: RootState) => state.projects.projects);
  const users = useSelector((state: RootState) => state.auth.users);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects() as any);
    }
  }, [dispatch, projects.length]);

  const initialValues = {
    title: issue?.title || '',
    description: issue?.description || '',
    status: issue?.status || 'open',
    priority: issue?.priority || 'medium' as Priority,
    projectId: issue?.projectId || projectId || '',
    taskId: issue?.taskId || taskId || '',
    assigneeId: issue?.assignedTo?.id || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Issue title is required'),
    description: Yup.string(),
    status: Yup.string().oneOf(['open', 'in_progress', 'resolved', 'closed']),
    priority: Yup.string().oneOf(['low', 'medium', 'high', 'critical']),
    projectId: Yup.string().required('Project is required'),
    taskId: Yup.string(),
    assigneeId: Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const issueData = { ...values };

        if (isEditing && issue) {
          await dispatch(updateIssue({ id: issue.id, data: issueData }) as any);
        } else {
          await dispatch(createIssue(issueData) as any);
        }

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error submitting issue:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Issue title"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Describe the issue in detail"
            {...formik.getFieldProps('description')}
          />
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
          <select
            id="projectId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('projectId')}
          >
            <option value="">Select a project</option>
            {projects.map((project: Project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            // name="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('status')}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            // name="priority"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700">Assignee</label>
          <select
            id="assigneeId"
            // name="assigneeId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('assigneeId')}
          >
            <option value="">Select an assignee</option>
            {users?.map((user: User) => (
              <option key={user.id} value={user.id}>{user.firstName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2 -ml-1 h-5 w-5" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <FiSave className="mr-2 -ml-1 h-5 w-5" />
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Issue' : 'Create Issue'}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;