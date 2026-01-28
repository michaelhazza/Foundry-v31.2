import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { FolderKanban, Plus, Database, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<any>('/projects?limit=5'),
  });

  const projects = projectsData?.data?.projects || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your data preparation projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Projects</h3>
          </div>
          <p className="text-3xl font-bold">{projectsData?.data?.pagination?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-700">Processing</h3>
          </div>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">Datasets</h3>
          </div>
          <p className="text-3xl font-bold">--</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link to="/projects/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No projects yet</p>
            <p className="text-sm mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.map((project: any) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
