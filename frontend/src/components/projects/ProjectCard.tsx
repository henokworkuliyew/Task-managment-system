import Link from 'next/link';
import { Project } from '../../types';
import { FiUsers, FiCalendar } from 'react-icons/fi';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { id, name, description, priority, progress, startDate, endDate, members } = project;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Link href={`/projects/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description || 'No description provided'}
        </p>
        
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          
          <div className="flex items-center">
            <FiUsers className="mr-1" />
            <span>{members.length} members</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;