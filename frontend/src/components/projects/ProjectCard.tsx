import Link from 'next/link';
import { Project } from '../../types';
import { 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiTrendingUp, 
  FiTarget,
  FiArrowRight,
  FiStar,
  FiActivity
} from 'react-icons/fi';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { id, name, description, priority, progress, startDate, endDate, members, status } = project;

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          text: 'text-white',
          icon: '🔥',
          glow: 'shadow-red-200'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          text: 'text-white',
          icon: '⚡',
          glow: 'shadow-yellow-200'
        };
      case 'low':
        return {
          bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
          text: 'text-white',
          icon: '🌱',
          glow: 'shadow-green-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          text: 'text-white',
          icon: '📋',
          glow: 'shadow-gray-200'
        };
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-emerald-500';
    if (progress >= 50) return 'from-blue-400 to-indigo-500';
    if (progress >= 25) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: FiTarget };
      case 'in_progress':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: FiActivity };
      case 'on_hold':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FiClock };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: FiStar };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const priorityConfig = getPriorityConfig(priority);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <Link href={`/projects/${id}`}>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-300 rounded-2xl"></div>
        
        {/* Priority badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`${priorityConfig.bg} ${priorityConfig.text} px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${priorityConfig.glow} flex items-center gap-1`}>
            <span>{priorityConfig.icon}</span>
            <span className="capitalize">{priority}</span>
          </div>
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 pr-20">
                {name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className={`${statusConfig.bg} ${statusConfig.color} px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium`}>
                <StatusIcon size={12} />
                <span className="capitalize">{status?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
            {description || 'No description provided'}
          </p>

          {/* Progress Section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiTrendingUp size={14} />
                Progress
              </span>
              <span className="text-sm font-bold text-gray-800">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(progress)} h-full rounded-full transition-all duration-500 shadow-sm`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-600" size={14} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Timeline</div>
                <div className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiUsers className="text-purple-600" size={14} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Team</div>
                <div className="font-medium">{members?.length || 0} members</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Click to view details
            </div>
            <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
              <span className="text-sm font-medium">View Project</span>
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;