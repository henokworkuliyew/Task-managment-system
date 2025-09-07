'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchIssues } from '../../redux/slices/issueSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { DashboardLayout } from '../../components/layout';
import { IssueCard, IssueForm } from '../../components/issues';
import { Button, Card, Modal } from '../../components/common';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { Issue, Project } from '@/types';

export default function IssuesPage() {
  const dispatch = useAppDispatch();
  const { issues, loading } = useAppSelector((state) => state.issues);
  const { projects } = useAppSelector((state) => state.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  useEffect(() => {
    dispatch(fetchIssues({}));
    dispatch(fetchProjects({}));
  }, [dispatch]);

  const filteredIssues = Array.isArray(issues) ? issues.filter((issue: Issue) => {
    if (filterStatus && issue.status !== filterStatus) return false;
    if (filterPriority && issue.priority !== filterPriority) return false;
    if (filterProject && issue.projectId !== filterProject) return false;
    return true;
  }) : [];

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingIssue(null);
    dispatch(fetchIssues({}));
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingIssue(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Issues</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
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
                <option value="critical">Critical</option>
              </select>
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
              >
                <option value="">All Projects</option>
                {Array.isArray(projects) ? projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                )) : null}
              </select>
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Issue
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No issues found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filterStatus || filterPriority || filterProject
                ? 'No issues match your current filters.'
                : 'Get started by creating a new issue.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={FiPlus}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Issue
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue: Issue) => (
              <IssueCard key={issue.id} issue={issue} onEdit={handleEditIssue} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title={editingIssue ? 'Edit Issue' : 'Create New Issue'}
        size="lg"
      >
        <IssueForm 
          issue={editingIssue} 
          onSuccess={handleCreateSuccess} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </DashboardLayout>
  );
}