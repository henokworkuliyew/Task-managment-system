'use client';

import { Project } from '../../types';
import { 
  FiCalendar, FiUsers, FiMoreVertical, FiEdit2, FiTrash2, FiEye, FiMessageSquare, 
  FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiTrendingUp, FiActivity,
  FiGitBranch, FiCheckCircle, FiAlertCircle, FiStar, FiClock, FiFlag, FiTarget
} from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on_hold':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-emerald-500 to-green-500';
    if (progress >= 60) return 'from-blue-500 to-cyan-500';
    if (progress >= 40) return 'from-amber-500 to-yellow-500';
    if (progress >= 20) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <FiActivity className="w-4 h-4" />;
      case 'on_hold':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const daysRemaining = project.endDate 
    ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header with Gradient Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-gray-100">
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-20 min-w-[140px] backdrop-blur-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                >
                  <FiEdit2 className="w-4 h-4 mr-3" />
                  Edit Project
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors">
                  <FiShare2 className="w-4 h-4 mr-3" />
                  Share
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors">
                  <FiGitBranch className="w-4 h-4 mr-3" />
                  Clone
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pr-12">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided'}
              </p>
            </div>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              {project.status.replace('_', ' ').toUpperCase()}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${getPriorityColor(project.priority)}`}>
              <FiFlag className="w-3 h-3" />
              {project.priority.toUpperCase()}
            </div>
            {project.progress === 100 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FiStar className="w-3 h-3" />
                COMPLETED
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4" />
                Progress
              </span>
              <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor(project.progress)} transition-all duration-500 ease-out relative overflow-hidden`}
                style={{ width: `${project.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="w-4 h-4" />
                <span className="font-medium">Timeline</span>
              </div>
              {daysRemaining !== null && (
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                  daysRemaining < 0 
                    ? 'bg-red-100 text-red-700' 
                    : daysRemaining <= 7 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                }`}>
                  {daysRemaining < 0 
                    ? `${Math.abs(daysRemaining)} days overdue` 
                    : daysRemaining === 0 
                      ? 'Due today' 
                      : `${daysRemaining} days left`
                  }
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Start: {formatDate(project.startDate)}</span>
                <span>End: {formatDate(project.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/projects/${project.id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <FiEye className="w-4 h-4" />
              View Details
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/chat/${project.id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <FiMessageSquare className="w-4 h-4" />
              Chat
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium">
              <FiUsers className="w-4 h-4" />
              {project.members?.length || 0} Members
            </button>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Team</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {project.members?.length || 0} members
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 4).map((member, index) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
                      title={member.name}
                    >
                      {member.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 4 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      +{(project.members?.length || 0) - 4}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {project.owner?.name?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{project.owner?.name || 'Unknown'}</div>
                  <div className="text-gray-500">Owner</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-full border border-gray-300 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-300">
                    +{project.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer with Interactions */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Interaction Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isLiked 
                    ? 'text-red-600 bg-red-50 border border-red-200' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <FiMessageCircle className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 20) + 2}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                className={`p-1.5 rounded-lg text-sm font-medium transition-all ${
                  isBookmarked 
                    ? 'text-amber-600 bg-amber-50 border border-amber-200' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 bg-gray-200 rounded-md font-mono">
                #{project.id.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
