'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createIssue, updateIssue } from '../../redux/slices/issueSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Issue, Project } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';

interface IssueFormProps {
  issue?: Issue | null;
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const IssueForm = ({ issue, projectId, onSuccess, onCancel }: IssueFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!issue;
  
  const projects = useAppSelector((state) => state.projects.projects);
  const users = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Only fetch projects if we don't have any projects loaded
    if (!Array.isArray(projects) || projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [dispatch, projects]);

  const initialValues = {
    title: issue?.title || '',
    description: issue?.description || '',
    status: issue?.status || 'open',
    severity: issue?.severity || 'medium',
    projectId: issue?.projectId || '',
    assigneeId: issue?.assignee?.id || '',
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Issue title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    description: Yup.string()
      .max(2000, 'Description must be less than 2000 characters'),
    status: Yup.string().oneOf(['open', 'in_progress', 'resolved', 'closed'], 'Invalid status'),
    severity: Yup.string().oneOf(['low', 'medium', 'high', 'critical'], 'Invalid severity'),
    projectId: Yup.string().required('Project is required'),
    assigneeId: Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        const baseData = {
          id: issue?.id || '',
          title: values.title || '',
          description: values.description || '',
          status: values.status as 'open' | 'in_progress' | 'resolved' | 'closed',
          severity: (values.severity || 'minor') as 'minor' | 'major' | 'critical',
          priority: (values.severity === 'critical' ? 'high' : 
                    values.severity === 'major' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          projectId: values.projectId || '',
        };

        if (values.assigneeId && values.assigneeId.trim() !== '') {
          (baseData as { assignedTo?: string }).assignedTo = values.assigneeId;
        }

        if (isEditing && issue) {
          const result = await dispatch(updateIssue({ id: issue.id, data: baseData }));
          if (updateIssue.fulfilled.match(result)) {
            toast.success('Issue updated successfully!');
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Failed to update issue');
          }
        } else {
          const createData = { ...baseData };
          const result = await dispatch(createIssue(createData));
          if (createIssue.fulfilled.match(result)) {
            toast.success('Issue created successfully!');
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Failed to create issue');
          }
        }
      } catch (error) {
        console.error('Error submitting issue:', error);
        toast.error(isEditing ? 'Failed to update issue' : 'Failed to create issue');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {isEditing ? 'Edit Issue' : 'Create New Issue'}
          </h2>
          <p className="text-gray-600">Fill in the details below to {isEditing ? 'update' : 'report'} an issue.</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            Issue Details
          </h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a clear and descriptive issue title..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                {...formik.getFieldProps('title')}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                rows={4}
                placeholder="Provide a detailed description of the issue, including steps to reproduce..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200 resize-vertical"
                {...formik.getFieldProps('description')}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formik.errors.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Assignment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Project Assignment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                id="projectId"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                {...formik.getFieldProps('projectId')}
              >
                <option value="">Select a project</option>
                {Array.isArray(projects) ? projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                )) : null}
              </select>
              {formik.touched.projectId && formik.errors.projectId && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formik.errors.projectId}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                id="assigneeId"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                {...formik.getFieldProps('assigneeId')}
              >
                <option value="">Select an assignee</option>
                {/* Note: Users list needs to be implemented properly */}
                {Array.isArray(users) ? users.map((user: { id: string; name?: string; email: string }) => (
                  <option key={user.id} value={user.id}>{user.name || user.email}</option>
                )) : null}
              </select>
            </div>
          </div>
        </div>

        {/* Status & Severity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            Status & Severity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                {...formik.getFieldProps('status')}
              >
                <option value="open">🔴 Open</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="resolved">🟢 Resolved</option>
                <option value="closed">⚫ Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                id="severity"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors duration-200"
                {...formik.getFieldProps('severity')}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
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
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  {isEditing ? 'Update Issue' : 'Create Issue'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;