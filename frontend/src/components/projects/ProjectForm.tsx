'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../../redux/slices/projectSlice';
import { Project, Priority } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    name: Yup.string().required('Project name is required'),
    description: Yup.string(),
    startDate: Yup.date().nullable(),
    endDate: Yup.date()
      .nullable()
      .when('startDate', (startDate, schema) => {
        return startDate
          ? schema.min(startDate, 'End date must be after start date')
          : schema;
      }),
    priority: Yup.string().oneOf(['low', 'medium', 'high']),
    tags: Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const projectData = {
          ...values,
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        };

        if (isEditing && project) {
          await dispatch(updateProject({ id: project.id, data: projectData }) as any);
        } else {
          await dispatch(createProject(projectData) as any);
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error submitting project:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name *
        </label>
        <input
          id="name"
          // name="name"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          // name="description"
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
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            id="startDate"
            // name="startDate"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('startDate')}
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.startDate}</div>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            id="endDate"
            // name="endDate"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            {...formik.getFieldProps('endDate')}
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.endDate}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            // name="priority"
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
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            // name="tags"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="frontend, backend, design"
            {...formik.getFieldProps('tags')}
          />
          {formik.touched.tags && formik.errors.tags && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.tags}</div>
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
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;