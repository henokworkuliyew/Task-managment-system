'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createIssue, updateIssue } from '../../redux/slices/issueSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { Issue, Project } from '../../types';
import { FiSave, FiX, FiAlertTriangle, FiFlag, FiFolder, FiUser } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

interface IssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue?: Issue | null;
  projectId?: string;
  onSuccess?: () => void;
}

const IssueDialog = ({ isOpen, onClose, issue, projectId, onSuccess }: IssueDialogProps) => {
  const dispatch = useAppDispatch();
  const { projects = [] } = useAppSelector((state) => state.projects || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!issue;

  const initialValues = {
    title: issue?.title || '',
    description: issue?.description || '',
    projectId: issue?.project?.id || projectId || '',
    severity: issue?.severity || 'medium',
    status: issue?.status || 'open',
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Issue title is required')
      .min(5, 'Issue title must be at least 5 characters')
      .max(200, 'Issue title must be less than 200 characters'),
    description: Yup.string()
      .required('Issue description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(2000, 'Description must be less than 2000 characters'),
    projectId: Yup.string().required('Project is required'),
    severity: Yup.string().oneOf(['low', 'medium', 'high', 'critical'], 'Invalid severity'),
    status: Yup.string().oneOf(['open', 'in_progress', 'closed'], 'Invalid status'),
  });

  useEffect(() => {
    if (isOpen && projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [isOpen, projects.length, dispatch]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const issueData = {
          title: values.title,
          description: values.description,
          projectId: values.projectId,
          severity: values.severity as 'low' | 'medium' | 'high' | 'critical',
          status: values.status,
          attachments: [],
        };

        if (isEditing && issue) {
          const result = await dispatch(updateIssue({ id: issue.id, data: issueData }));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Issue updated successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Update failed');
          }
        } else {
          const result = await dispatch(createIssue(issueData));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Issue reported successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Creation failed');
          }
        }
      } catch {
        toast.error(isEditing ? 'Failed to update issue' : 'Failed to report issue');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const selectedProject = Array.isArray(projects) 
    ? projects.find((project: Project) => project.id === formik.values.projectId)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{issue ? 'Edit Issue' : 'Report New Issue'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-500 rounded-lg mr-3">
                <FiAlertTriangle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-medium text-gray-800">Issue Details</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Brief description of the issue..."
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
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
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and actual behavior..."
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                  {...formik.getFieldProps('description')}
                />
                <div className="text-xs text-gray-500 mt-1">
                  💡 <strong>Tip:</strong> Include steps to reproduce, expected vs actual behavior, and any error messages
                </div>
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500 rounded-lg mr-3">
                  <FiFolder className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Project</h4>
              </div>
              
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                  Affected Project *
                </label>
                <select
                  id="projectId"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  {...formik.getFieldProps('projectId')}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {selectedProject && (
                  <div className="text-xs text-blue-600 mt-1 flex items-center">
                    <FiUser className="w-3 h-3 mr-1" />
                    Owner: {selectedProject.owner?.name}
                  </div>
                )}
                {formik.touched.projectId && formik.errors.projectId && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.projectId}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-500 rounded-lg mr-3">
                  <FiFlag className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-medium text-gray-800">Classification</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    id="severity"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    {...formik.getFieldProps('severity')}
                  >
                    <option value="low">🟢 Low - Minor issue</option>
                    <option value="medium">🟡 Medium - Moderate impact</option>
                    <option value="high">🟠 High - Significant impact</option>
                    <option value="critical">🔴 Critical - System breaking</option>
                  </select>
                  {formik.touched.severity && formik.errors.severity && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.severity}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                    {...formik.getFieldProps('status')}
                  >
                    <option value="open">🆕 Open</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm mt-2 flex items-center">
                      <FiX className="w-4 h-4 mr-1" />
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-500 rounded-lg">
                  <FiAlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Issue Reporting Guidelines</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Be specific and descriptive in your title</li>
                    <li>• Include steps to reproduce the issue</li>
                    <li>• Mention expected vs actual behavior</li>
                    <li>• Add any error messages or screenshots if available</li>
                    <li>• Select appropriate severity based on business impact</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

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
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Reporting...'}
                </>
              ) : (
                <>
                  <FiSave className="mr-2 w-4 h-4" />
                  {isEditing ? 'Update Issue' : 'Report Issue'}
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDialog;
