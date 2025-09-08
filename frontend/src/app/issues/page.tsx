'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchIssues } from '../../redux/slices/issueSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { IssueCard, IssueForm } from '../../components/issues';
import { Button, Card, Modal } from '../../components/common';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { Issue, Project } from '@/types';
import { useRouter } from 'next/navigation';

export default function IssuesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { issues, isLoading } = useAppSelector((state) => state.issues);
  const { projects } = useAppSelector((state) => state.projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  
  useEffect(() => {
    // Smart fetching: only fetch if we don't have data already (like social media apps)
    if (!Array.isArray(issues) || issues.length === 0) {
      dispatch(fetchIssues({}));
    }
    if (!Array.isArray(projects) || projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [dispatch, issues, projects]);

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
    <>
      <div className="min-h-full bg-white rounded-xl shadow-sm">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Issues</h1>
              <p className="text-red-100 mt-1">Track and manage project issues</p>
            </div>
            <Button
              variant="outline"
              icon={FiPlus}
              onClick={() => router.push('/issues/new')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50"
            >
              New Issue
            </Button>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
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
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading issues...</p>
          </Card>
        ) : filteredIssues.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiPlus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus || filterPriority || filterProject
                ? 'No issues match your current filters.'
                : 'Get started by creating your first issue.'}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Issue
            </Button>
          </Card>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue: Issue) => (
                <IssueCard key={issue.id} issue={issue} onEdit={handleEditIssue} />
              ))}
            </div>
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
    </>
  );
}