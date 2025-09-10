'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../redux/hooks';
import { createProject, updateProject } from '../../redux/slices/projectSlice';
import { Project, Priority } from '../../types';
import { FiSave, FiX, FiPlus, FiMail, FiTrash2, FiUsers, FiCalendar, FiFlag, FiTag } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSuccess?: () => void;
}

const ProjectDialog = ({ isOpen, onClose, project, onSuccess }: ProjectDialogProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberEmails, setMemberEmails] = useState<string[]>(['']);
  const isEditing = !!project;

  const initialValues = {
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    priority: project?.priority || 'medium' as Priority,
    tags: project?.tags?.join(', ') || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Project name is required')
      .min(3, 'Project name must be at least 3 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: Yup.string()
      .max(1000, 'Description must be less than 1000 characters'),
    startDate: Yup.date().nullable(),
    endDate: Yup.date()
      .nullable()
      .when('startDate', (startDate, schema) => {
        return startDate && startDate[0]
          ? schema.min(startDate[0], 'End date must be after start date')
          : schema;
      }),
    priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority'),
    tags: Yup.string(),
  });

  const addMemberEmail = () => {
    setMemberEmails([...memberEmails, '']);
  };

  const removeMemberEmail = (index: number) => {
    if (memberEmails.length > 1) {
      setMemberEmails(memberEmails.filter((_, i) => i !== index));
    }
  };

  const updateMemberEmail = (index: number, email: string) => {
    const updatedEmails = [...memberEmails];
    updatedEmails[index] = email;
    setMemberEmails(updatedEmails);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const validMemberEmails = memberEmails
          .filter(email => email.trim() !== '')
          .filter(email => validateEmail(email.trim()));

        const projectData = {
          ...values,
          startDate: values.startDate || '',
          endDate: values.endDate || '',
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
          memberEmails: validMemberEmails.length > 0 ? validMemberEmails : undefined,
          status: project?.status || 'not_started',
        };

        if (isEditing && project) {
          const result = await dispatch(updateProject({ id: project.id, data: projectData }));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Project updated successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Update failed');
          }
        } else {
          const result = await dispatch(createProject(projectData));
          if (result.type.endsWith('/fulfilled')) {
            toast.success('Project created successfully!');
            onClose();
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Creation failed');
          }
        }
      } catch {
        toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setMemberEmails(['']);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-500 rounded-lg mr-3">
              <FiFlag className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-medium text-gray-800">Project Details</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter a descriptive project name..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <FiX className="w-4 h-4 mr-1" />
                  {formik.errors.name}
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
                placeholder="Provide a detailed description of the project..."
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
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

        {/* Timeline & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-medium text-gray-800">Timeline</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  {...formik.getFieldProps('startDate')}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.startDate}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  {...formik.getFieldProps('endDate')}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.endDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-500 rounded-lg mr-3">
                <FiTag className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-medium text-gray-800">Settings</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
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
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  placeholder="frontend, backend, design"
                  {...formik.getFieldProps('tags')}
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                {formik.touched.tags && formik.errors.tags && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <FiX className="w-4 h-4 mr-1" />
                    {formik.errors.tags}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section - Only for new projects */}
        {!isEditing && (
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-500 rounded-lg mr-3">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-medium text-gray-800">Team Members</h4>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Invite team members to collaborate on this project. They&apos;ll receive email invitations to join.
            </p>
            
            <div className="space-y-3">
              {memberEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateMemberEmail(index, e.target.value)}
                        placeholder="Enter team member's email address"
                        className={`block w-full pl-10 pr-4 py-3 rounded-lg border shadow-sm focus:ring-2 transition-all duration-200 ${
                          email && !validateEmail(email) 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                        }`}
                      />
                    </div>
                    {email && !validateEmail(email) && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <FiX className="w-3 h-3 mr-1" />
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                  
                  {memberEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMemberEmail(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Remove email"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMemberEmail}
                className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-sm"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Another Team Member
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
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
                {isEditing ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
