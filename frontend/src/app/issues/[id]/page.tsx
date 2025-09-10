'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchIssueById } from '../../../redux/slices/issueSlice';
import { fetchProjects } from '../../../redux/slices/projectSlice';
import { Button, Modal } from '../../../components/common';
import { IssueForm } from '../../../components/issues';
import { 
  FiArrowLeft,
  FiEdit,
  FiUser,
  FiClock,
  FiTarget,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiFlag,
  FiFolder,
  FiMessageSquare,
  FiTrendingUp,
  FiBarChart,
  FiAlertOctagon,
  FiAlertTriangle,
  FiZap
} from 'react-icons/fi';

export default function IssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentIssue: issue, isLoading: issueLoading } = useAppSelector((state) => state.issues);
  const { projects } = useAppSelector((state) => state.projects);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchIssueById(id as string));
      // Fetch projects if not already loaded
      if (!Array.isArray(projects) || projects.length === 0) {
        dispatch(fetchProjects({}));
      }
    }
  }, [dispatch, id, projects]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    dispatch(fetchIssueById(id as string));
  };

  if (issueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Issue not found</h3>
            <p className="text-gray-600 mb-6">
              The issue you are looking for does not exist or has been deleted.
            </p>
            <Button
              variant="primary"
              icon={FiArrowLeft}
              onClick={() => router.push('/issues')}
            >
              Back to Issues
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-gradient-to-r from-red-600 to-red-700 text-white';
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getSeverityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <FiZap className="h-4 w-4" />;
      case 'high':
        return <FiAlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <FiFlag className="h-4 w-4" />;
      case 'low':
        return <FiAlertOctagon className="h-4 w-4" />;
      default:
        return <FiAlertOctagon className="h-4 w-4" />;
    }
  };

  const project = Array.isArray(projects) ? projects.find((p) => p.id === issue.projectId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon={FiArrowLeft}
                onClick={() => router.push('/issues')}
                className="hover:bg-slate-100"
              >
                Back
              </Button>
              <div className="h-8 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                <p className="text-sm text-gray-600">Issue Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                icon={FiEdit}
                onClick={() => setIsEditModalOpen(true)}
                className="border-slate-300 hover:border-slate-400"
              >
                Edit Issue
              </Button>
              {project && (
                <Link href={`/projects/${project.id}`}>
                  <Button
                    variant="outline"
                    icon={FiFolder}
                    className="hover:bg-slate-100"
                  >
                    View Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Issue Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Issue Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <FiAlertOctagon className="mr-3 h-8 w-8 text-red-500" />
                    <h2 className="text-3xl font-bold text-gray-900">{issue.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">{issue.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-3 ml-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getPriorityColor(issue.priority || 'medium')}`}>
                    {getSeverityIcon(issue.priority || 'medium')}
                    <span className="ml-2">{issue.priority || 'medium'} Priority</span>
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                    <FiActivity className="mr-2 h-4 w-4" />
                    {issue.status}
                  </span>
                </div>
              </div>

              {/* Issue Type & Severity Alert */}
              {issue.priority === 'critical' && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border-l-4 border-red-500 mb-6">
                  <div className="flex items-center">
                    <FiZap className="h-6 w-6 text-red-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Critical Issue</h3>
                      <p className="text-red-700">This issue requires immediate attention and may impact system functionality.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Issue Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-4 h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reported By</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {issue.reporter?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-4 h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assigned To</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {issue.assignee?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-4 h-6 w-6 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {project && (
                    <div className="flex items-center text-gray-600">
                      <FiFolder className="mr-4 h-6 w-6 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project</p>
                        <Link href={`/projects/${project.id}`}>
                          <p className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            {project.name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Status */}
              {issue.status === 'closed' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-center text-green-600">
                    <FiCheckCircle className="mr-3 h-8 w-8" />
                    <div>
                      <h3 className="text-lg font-semibold">Issue Resolved!</h3>
                      <p className="text-sm text-green-700">This issue has been successfully resolved</p>
                    </div>
                  </div>
                </div>
              )}

              {issue.status === 'in_progress' && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FiTrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                      Resolution Progress
                    </h3>
                    <span className="text-sm font-medium text-blue-600">In Progress</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Issue is currently being investigated and resolved</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTarget className="mr-2 h-5 w-5 text-red-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon={FiEdit}
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full justify-start border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  Edit Issue
                </Button>
                {project && (
                  <Link href={`/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      icon={FiFolder}
                      className="w-full justify-start border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    >
                      View Project
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  icon={FiBarChart}
                  onClick={() => {/* Add analytics view */}}
                  className="w-full justify-start border-green-200 hover:border-green-300 hover:bg-green-50"
                >
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Issue Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiAlertOctagon className="mr-2 h-5 w-5 text-red-500" />
                Issue Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Priority</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority || 'medium')}`}>
                    {issue.priority || 'medium'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <span className="text-sm text-gray-900">
                    {issue.type || 'Bug'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {issue.resolvedAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Resolved</span>
                    <span className="text-sm text-gray-900">
                      {new Date(issue.resolvedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Steps to Reproduce */}
            {issue.stepsToReproduce && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiActivity className="mr-2 h-5 w-5 text-orange-500" />
                  Steps to Reproduce
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {issue.stepsToReproduce}
                  </pre>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMessageSquare className="mr-2 h-5 w-5 text-purple-500" />
                Comments & Updates
              </h3>
              <div className="text-center py-8">
                <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">No comments yet</p>
                <Button
                  variant="outline"
                  className="mt-3 text-xs"
                  onClick={() => {/* Add comment functionality */}}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Issue"
        size="lg"
      >
        <IssueForm 
          issue={issue} 
          onSuccess={handleEditSuccess} 
          onCancel={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
