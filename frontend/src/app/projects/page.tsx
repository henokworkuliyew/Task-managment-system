'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { DashboardLayout } from '../../components/layout';
import { ProjectCard, ProjectForm } from '../../components/projects';
import { Button, Card, Modal } from '../../components/common';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { Project } from '@/types';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('');

  useEffect(() => {
    dispatch(fetchProjects({}));
  }, [dispatch]);

  const filteredProjects = filterPriority
    ? projects.filter((project: Project) => project.priority === filterPriority)
    : projects;

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    dispatch(fetchProjects({}));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filterPriority
                ? `No projects with ${filterPriority} priority found.`
                : 'Get started by creating a new project.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={FiPlus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>
    </DashboardLayout>
  );
}