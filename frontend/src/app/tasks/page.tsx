'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { TaskCard } from '../../components/tasks';
import { Button, Card } from '../../components/common';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { Project, Task } from '@/types';

export default function TasksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tasks, isLoading } = useAppSelector((state) => state.tasks);
  const { projects } = useAppSelector((state) => state.projects);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterProject, setFilterProject] = useState<string>('');

  useEffect(() => {
    // Smart fetching: only fetch if we don't have data already (like social media apps)
    if (!Array.isArray(tasks) || tasks.length === 0) {
      dispatch(fetchTasks({}));
    }
    if (!Array.isArray(projects) || projects.length === 0) {
      dispatch(fetchProjects({}));
    }
  }, [dispatch, tasks, projects]);

  const filteredTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => {
    if (filterStatus && task.status !== filterStatus) return false;
    if (filterProject && task.project?.id !== filterProject) return false;
    return true;
  }) : [];

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/edit/${task.id}`);
  };

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
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
              onClick={() => {
                console.log('New Task button clicked - navigating to /tasks/new');
                router.push('/tasks/new');
              }}
            >
              New Task
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filterStatus || filterProject
                ? 'No tasks match your current filters.'
                : 'Get started by creating a new task.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={FiPlus}
                onClick={() => router.push('/tasks/new')}
              >
                Create Task
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task:Task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </div>
        )}
      </div>
  );
}