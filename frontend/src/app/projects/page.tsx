'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { ProjectCard } from '../../components/projects';
import { Button, Card } from '../../components/common';
import { ProjectDialog } from '../../components/dialogs';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import { Project } from '@/types';

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projects, isLoading } = useAppSelector((state) => state.projects);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...(searchQuery && { search: searchQuery })
    };
    dispatch(fetchProjects(params));
  }, [dispatch, currentPage, searchQuery]);

  const displayProjects = Array.isArray(projects) 
    ? (filterPriority
        ? projects.filter((project: Project) => project.priority === filterPriority)
        : projects)
    : [];

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
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
              onClick={() => setIsCreateDialogOpen(true)}
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              New Project
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : displayProjects.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filterPriority || searchQuery
                ? 'No projects match your current filters.'
                : 'Get started by creating a new project.'}
            </p>
            <div className="mt-6 text-gray-950">
              <Button
                variant="primary"
                icon={FiPlus}
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project: Project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={(project: Project) => setEditingProject(project)}
              />
            ))}
          </div>
        )}

        {displayProjects.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={displayProjects.length < 10}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        <ProjectDialog
          isOpen={isCreateDialogOpen || !!editingProject}
          onClose={() => {
            setIsCreateDialogOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSuccess={() => {
            dispatch(fetchProjects({}));
          }}
        />
      </div>
  );
}